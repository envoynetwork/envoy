# Get current token balances of token

First, fetch all the transactions from [Etherscan](https://etherscan.io/address/0xf1d1a5306daae314af6c5d027a492b313e07e1a0)

Make sure you have `.secret` and `.infuraKey`files containing the relevant keys in the parent `contract` folder.

Make sure node is installed and install the dependencies in the package.json file in the parent `contract` folder.

Next, run `node get_all_buyers --file $FILE` with file the location to an export of Etherscan. Defaults to `input/export_etherscan.csv`