==================================================================================

2. Pack Size Field

Abhi unit hai.

Lekin pack size nahi hai.

Example:

Maggi Packet

Question:

Packet me kitna?

50g
70g
140g
280g

Sab same packet nahi hote.

Add:

Pack Size

Example:

50 g
100 g
250 g
500 g

==================================================================================

4. FIFO Auto Deduction

Current risk:

Shopkeeper sells:

Old stock
New stock

System randomly deduct kar raha.

Wrong.

Should always deduct:

Nearest expiry first

Example:

Batch A
Expiry June

Batch B
Expiry August

Sell:

5 packet

Deduct from June batch.

Mandatory.

==================================================================================

13. MRP

Current:

Buy Price
Sell Price

Missing:

MRP

Many kirana items have printed MRP.

Need:

MRP
Sell Price

Validation:

Sell > MRP ?
Warning

==================================================================================

18. Negative Stock Prevention

Never allow:

Stock = -5

Hard block.

19. Duplicate Product Detection

Prevent:

Sugar
SUGAR
Sugar 1kg
Sugar-1kg

Duplicate creation.

20. Decimal Precision Engine

Critical.

Example:

0.125 kg
0.250 kg
0.333 kg

Never use float directly.

Store:

grams
ml
pieces

integer base units only.

==================================================================================
