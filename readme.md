# $ENVOY Token

### Utility token to use on envoy.art and related platforms

------------------------
//    SMART CONTRACT   
------------------------

Using "Openzeppelin" to make sure the ERC20 standard is respected.
https://openzeppelin.com/

Access rights:

- Contract owner will be able to update contract owner
- Contract owner will be able to set other addresses
- Contract owner will be able to update private sale buyers

------------------------
//    LOCAL   
------------------------

Truffle & Ganache:

- https://www.trufflesuite.com/
- https://www.trufflesuite.com/ganache
- Ganache to set up local Ethereum blockchain
- Truffle to test and deploy contracts (local, testnet, mainnet)

Install HDWallet-Provider to be able to deploy to testnet and mainnet:
- npm install @truffle/hdwallet-provider

Install chai:
- npm install --save-dev chai

Excluded files:

- .secret = private key for deployer wallet
- .infuraKey = Infura API key

Useful commands:

- $ truffle test
- $ truffle test ./test/mint.js 
- $ truffle migrate --network development
- $ truffle migrate --reset --network rinkeby


------------------------
//    TESTNET   
------------------------

- Get ETH on Goerli testnet: https://app.mycrypto.com/faucet
- Get ETH on Rinkeby testnet: https://www.rinkeby.io/#faucet
- Use Infura (infura.io) to connect to an Ethereum node

------------------------
//    MAINNET   
------------------------

- Use Infura (infura.io) to connect to an Ethereum node
