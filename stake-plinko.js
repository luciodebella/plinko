//
// Cosntants & Variables
////////////////////////////////////////////////////////////////////

/* --------------- DOM --------------- */
const betBtn = document.querySelector('button[data-test="bet-button"]'),
betInput = document.querySelector('input[data-test="input-game-amount"]');
lastBetsWrapper = document.querySelector('.last-bet-wrap')
configsBtn = document.querySelector('button[data-test="game-settings"]'),
riskSelect = document.querySelector('select[data-test="risk-select"]'),
rowsSelect = document.querySelector('select[data-test="rows-select"]');

var configQuickPlayBtn, configAnimationsBtn;

/* --------------- Logical Control --------------- */
const RESULTS = {
  LOSS: 0,
  WIN: 1,
  DRAW: 2
}

// Configs:
var BASE_BET = 0.0001,
BASE_WALLET_AMOUNT,
COMEBACK_MULTIPLIER = 1.1,
RISK = 'medium',
ROWS = 12,
TARGET_WIN_AMOUNT = 1500;

// Others
var MINIMUM_BET_AMOUNT = 0.001,
mutationHappened = false,
lastResult = RESULTS.WIN,
lastBet = 0,
sumLoss = 0,
losses = 0,
currentWalletAmount,
lastWinWallettAmount,
maxWalletAmount = 0,
currentBet,
GAME_STOPPED = false;

//
// Methods & Functions
////////////////////////////////////////////////////////////////////

async function init(){
  console.clear();
  if(BASE_BET == undefined){
    BASE_BET = getBaseBet();
  } else {
    await setNewBet(BASE_BET);
  }

  if(RISK){
    await setRisk();
  }

  if(ROWS){
    await setRows();
  }
  
  currentBet = BASE_BET;
  currentWalletAmount = getWalletCurrentAmount();
  if(!BASE_WALLET_AMOUNT){
    BASE_WALLET_AMOUNT = currentWalletAmount;
  }
  maxWalletAmount = currentWalletAmount;
  setupMutationObserver(lastBetsWrapper, onRoundFinished);

  configsBtn.click();
  await sleep(100);
  configQuickPlayBtn = document.querySelectorAll('.tooltip-wrapper .variant-dropdown')[1]
  configQuickPlayBtn.click();
  await sleep(100);
  configAnimationsBtn = document.querySelectorAll('.tooltip-wrapper .variant-dropdown')[2]
  configAnimationsBtn.click();
  await sleep(100);

  console.log('Base wallet amount:', BASE_WALLET_AMOUNT);
  console.log('Target wallet amount:', TARGET_WIN_AMOUNT);
  console.log('Starting game in 3s . . .');
  await sleep(3000);

  betBtn.click();
}

function setupMutationObserver(target, callback){
  new MutationObserver((mutations) => {
    mutations.forEach(async ({type, target}) => {
      if(mutationHappened){
        return;
      }
      
      mutationHappened = true;

      await sleep(100);
      
      callback();
    });
  }).observe(target, { childList: true, subtree: true });
}

async function prepareNextRound(){
  const lastResultModifier = parseFloat(lastBetsWrapper.querySelector('button[data-last-bet-index="0"]').innerHTML.replace('x', '').replace(',', '.'));
  var resultMsgLog = '';
  currentWalletAmount = getWalletCurrentAmount();

  // Win
  if(lastResultModifier >= 2){
    onRoundWon(lastResultModifier);
  }
  // Loss
  else if(lastResultModifier < 1){
    onRoundLost(lastResultModifier);
  }
  // Draw
  else {
    onRoundTied(lastResultModifier);
  }

  if(currentBet < MINIMUM_BET_AMOUNT){
    currentBet = MINIMUM_BET_AMOUNT;
  }

  currentBet = parseFloat(currentBet.toFixed(8));
  
  await setNewBet(currentBet);
  
  resultMsgLog = `${getResultString(lastResult)} ${lastResultModifier}x | WALLET ${currentWalletAmount} | NEW BET ${currentBet} - ${new Date()} | MAX WALLET ${maxWalletAmount}`;

  switch(lastResult){
    case RESULTS.WIN:
      console.warn(resultMsgLog);
      break;
    case RESULTS.LOSS:
      console.error(resultMsgLog + ` | Losses ${losses}`);
      break;
    default:
      break;
  }
}

function playRound(){
  if(!GAME_STOPPED){
    betBtn.click();
  } else {
    console.log('Game stopped.');
  }
}

function stop(){
  GAME_STOPPED = true;
}

//
// Utilitties
////////////////////////////////////////////////////////////////////

function getBaseBet(){
  return parseFloat(betInput.value);
}

async function setNewBet(amount){
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  nativeInputValueSetter.call(betInput, amount.toFixed(8));

  var ev2 = new Event('input', { bubbles: true});
  betInput.dispatchEvent(ev2);


  triggerEvent(betInput, 'change');
  await sleep(100);
}

async function setRisk(){
  riskSelect.value = RISK;
  triggerEvent(riskSelect, 'change');
  await sleep(100);
}

async function setRows(){
  rowsSelect.value = ROWS;
  triggerEvent(rowsSelect, 'change');
  await sleep(100);
}

function getWalletCurrentAmount(){
  return parseFloat(document.querySelector('.balance-toggle .currency .content').innerText);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function triggerEvent(targetElement, eventName){
  var e = document.createEvent('HTMLEvents');
  e.initEvent(eventName, false, true);
  targetElement.dispatchEvent(e);
}

function getResultString(result){
  switch(result){
    case RESULTS.WIN:
    return 'WIN';
    case RESULTS.LOSS:
    return 'LOSS';
    case RESULTS.DRAW:
    return 'DRAW';
  }
}

//
// Events
////////////////////////////////////////////////////////////////////

function onRoundFinished(){
  prepareNextRound();

  if(currentBet <= currentWalletAmount){
    playRound();
    mutationHappened = false;
  } else {
    console.log('Insufficient wallet amount. You loose. :(');
  }
}

function onRoundWon(lastResultModifier){
  losses = 0;
  lastResult = RESULTS.WIN;
  currentBet = BASE_BET;
  sumLoss = 0;
  
  if(currentWalletAmount > maxWalletAmount){
    maxWalletAmount = currentWalletAmount;
  }

  if(TARGET_WIN_AMOUNT && TARGET_WIN_AMOUNT > 0){
    if(currentWalletAmount >= BASE_WALLET_AMOUNT + TARGET_WIN_AMOUNT){
      console.warn('¡¡¡ TARGET_WIN_AMOUNT REACHED !!!');
      stop();
    }
  }
}

function onRoundLost(lastResultModifier){
  lastResult = RESULTS.LOSS;
  sumLoss += (currentBet * (1-lastResultModifier));
  sumLoss = parseFloat(sumLoss.toFixed(8));
  currentBet = sumLoss * COMEBACK_MULTIPLIER;
  losses++;
}

function onRoundTied(lastResultModifier){
  lastResult = RESULTS.DRAW;

  if(lastResultModifier > 1){
    sumLoss -= (currentBet * (lastResultModifier-1));
    if(sumLoss < 0){
      sumLoss = 0;
    }
    currentBet = sumLoss * COMEBACK_MULTIPLIER;
  }
}

//
// Init
////////////////////////////////////////////////////////////////////

init();

// https://www.varsitytutors.com/hotmath/hotmath_help/spanish/topics/binomial-probability