# Plinko Bot ~by Ludev

A Plinko bot for the stake casino website.
TRON (TRX) currency recommended as it allows low values for betting.
Base bet of 0.0001 recommended.

# How it works

Plinko bot will configure risk and rows if variables are set in the code and start betting the base amount configured.
If multiplier result is greater/equal to 2, the currentBet will be reset to baseBet. This is consider as a WIN.
If multiplier result is less than 1, the currentBet will be equal to sumLoss * COMEBACK_MULTIPLIER. This is consider as a LOSS.
If multiplier result is less than 2 and greater than 1, the sumLoss will be reduced by the amount won. This is consider as a TIE.

Game will stop TARGET_WIN_AMOUNT when reached (if configured) or when the Bot is unable to keep playing because of insufficient amount in the wallet. F.

** IMPORTANT NOTE **
You need to keep the stake's plinko game window at front. If not, Js is not processed by the browser.

** IMPORTANT NOTE **
The developer is not rwesponsable for any loss that this bot could generate, as it is not responsable for any win either.
This is under the user responsability only.

# How to use

1. BASE_BET: Set it as the base bet you wanna play every round.
2. BASE_WALLET_AMOUNT: This will be the current wallet amount on your account. If a value is set, that value will be the wallet base.
3. COMEBACK_MULTIPLIER: A multiplier for sumLoss on every round lost.
4. RISK: Set the risk for the game ('low', 'medium', 'high').
5. ROWS: Set the rows for the game (1 up to 16).
6. TARGET_WIN_AMOUNT: At this amount the game will stop. If null or zero, the bot won't stop playing.
7. Copy all the code into the plinko stake browser's console and press enter.

The bot will show:

"Base wallet amount: BASE_WALLET_AMOUNT"
"Target wallet amount: TARGET_WIN_AMOUNT"
"Starting game in 3s . . ."

And it will start playing.

Call stop() on browser's console to stop playing.