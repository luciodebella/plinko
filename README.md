# plinko

A Plinko bot for the stake casino website.
TRON (TRX) currency recommended as it allows low values for betting.

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