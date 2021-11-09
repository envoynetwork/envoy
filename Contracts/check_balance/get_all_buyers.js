const Web3 = require('web3')
const abiDecoder = require('abi-decoder');
const fs = require('fs');
const abi = require('../build/contracts/EnvoyToken.json')


const infuraKeyProduction = fs.readFileSync("../../secrets/.infuraKeyProduction").toString().trim();
var privateKey = fs.readFileSync("../../secrets/.secret").toString().trim();

const webProvider = "https://mainnet.infura.io/v3/"+infuraKeyProduction;
const web3 = new Web3(webProvider);

var account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const contract = new web3.eth.Contract(abi.abi, "0xf1d1a5306daae314af6c5d027a492b313e07e1a0");


const transactions = ['0xb2c4f41edd9d994f38eb1bcf68667f94433c05f0f1212ea5576357d7178ec6ce',
'0x2a9eb3a1ee2d8ee857bb91afe09faebca2fc39f060a7055be39aeaebd409deea',
'0x4c7e47329d5b4462c80edb51f168fa28ffcc72a213e8d3ecb136ffad9c799ca0',
'0x35606a285b32858113cd5753266a62813b4af6d239fa3aaca2f037e1bddd3e63',
'0x043ac27eed825b9afdf9552a900f2317963aa77bdd7ccf767096a1d279a37390',
'0x8cd928f875d22366ef2bf20a935d3f33609fd50612c25e364ed86f94f2570965',
'0xb64ebb4fe708a6fd1af06a722cb1809c56e48480d9ad53879b19e9a7020df06d',
'0x2bf12816b944dd449204c402fd4f3ff51643bfe6bceae8b3d30711968c18eaa9',
'0xb99571bb3904b7110287f0f20f6ed5ae0fc7b2c8e7abfb28ace55ec12f40b0f1',
'0xf55fa997c6d3dd580ea00be0e0d06abb5dd64f3296a4aa1faace6e3561f7477f',
'0x10be0a20928d40f683c3db556c5f623bb23b29a36ece24f525663db4e78417c9',
'0x11470864449737e7a0c47a09a59a26fd9880f67a64df9cd62aec0a31b84fd850',
'0x7e579ceaf4f04286c774a1c3acafb7f6177543b37334adab5ffb378189777b98',
'0x490f9bd83cbd6a8522cfb84f73dc6b37adf53484946352dc666cc556511de814',
'0x57a2e489c8c15225b8d3790926df16b8d48e69118d1ff8aeed0e069d0fa367de',
'0xc9ce45a32cd6fffe8a466f62b57363a0088b6da5fe90cbb062d63f7fa88afd9f',
'0xfe8efc093d5562a05559de0342bdccc501cbe46e7cac72beaf04cc2d72969ec4',
'0x4f4ccefaac8077b218ff770ae61c17979b401d2d4d423955914166cdcab999cf',
'0x7a815eb14c98c693a7ab49e603e88c3caf31e3f79438c6f9da880aea540717a8',
'0x4ba9ce1c462c4422e6cc392d7a4da418e4095dcb8e79ceb41d61aa7014afd363',
'0xdc726fd20aaa3e9611b36b360c1a0b9039c4dfea59e0ea65b2cf6edd95173b91',
'0x14bd82e83cef5203457f178352859a55e1683f6ee4d7aef6b5919394a2b4b21d',
'0x45d8d039e6acf60a48f80fe45cf92666849aaaacbbbe6591a3f185efed193202',
'0xccfe894b3b3aa3b2e339df4acc6c72a38e336d0b549df84b0f7e960a31c05c6e',
'0xb1814a18f9d04931920fa0904e218e6bb2cc71a64ae95f992c7e9d3076d3fc69',
'0x89c482ed83878bbcd867b0b15dfc02d06a68b6afe64114a4007e928f6d441ed4',
'0x90192d3a7459b11f2b3c1044c78086a850879cb5264624225bc0496ee8f2380f',
'0x3fa353321f94d76a8590061c0f69ab46be00f6df88c8bed1dc364a65a92e8670',
'0xf27f6949b305b83756706af7a3c01763d02fadbce74a3d10cb89042271712620',
'0x161cd14cec8965c38583c8eb256b199e1633f515431be150726ad6ef757a6d95',
'0xf95ff762e75eefc43522ece252ed16109a2e1929ea24d2a2b4e6ec9b1f1662f8',
'0x4f3e991cb0e7df86fb5c78eda23230c9e0897d3e521d8b6ba0d78dcecc33b35f',
'0x590500fde9259dfae6ad20145605e45c3551f56abf9e3159292b08b9a32a0802',
'0x13948220d4e45166d7bf913f4961ba834a6ba27c1091fc37138990aa2814cc3c',
'0x2b61f5e71272089a8f40131e346b829ff9793c92165a43729467599e77b58e2f',
'0xfe066aa6833055111d53d94d7e562605f5582da891b03da78b6a89eb8f44db8a',
'0xfa8f9c8acdac8056e5f00f957891affb569074c147d705d49b4d3d598d147b86',
'0x0a36e683abdab4c938acb1b00a381d7494405510d95bbcb2288766fd5dea5cfc',
'0x7dbc46bdc1d4ae89db77d22b1dedfe48c4955eb465cc49dc460117afd9e120bf',
'0x8faed810d5f9f3e067d20ce549bbda270bbd390429797d21e1a729e011a51906',
'0x9a437c4b38bde0fc6cd71b73569b2d11410030c9c2dbe81ad38c6c337c650261',
'0x11cf9fff002b82496d23f4f39164a798efb51f2ff7fba29074dbd6b4e2de63f0',
'0x87d0654531c79cdaef3540acfc17505136c9d8074607d5e4873fdfa7d929380c',
'0x1fc555bb2023d344bc7774d0dfd75034811720cd6101336c83837ee936e19c6f',
'0x2169d6677b7dfed236d3ab5baee52ab6dc8c4ba4352713ee04902723b367cc8f',
'0x43a4bd9c6186ceec7f55e49aa0236bb6bd6600e9b45fab7d249cfeff502b01c8',
'0xe949304fa5d52126be04af4fc4401ee75f2eda1e226c678c67ee22e70eaba1da',
'0x563a18282fc1c5fe6fc04973f32b279a6d6943127ce955fe16b2876cb8f5a7fc',
'0xfd887f09e31fad18f6dadf8f9af4df25cbfa6c9424fb29b17dc17b1acd66f1f2',
'0x6c13d034fe08acaabb00e14a13ce4075215ef56e6e625b1b38611cf16899ee58',
'0xc2724fea763f007e6954abd1d34699e017e8ae5710135b8704fda56c20bb37e8',
'0x944a766e4ebd12d097dc64d2c12e157a5fa1c3d2f0283989f12d7231b37d88c8',
'0xfa704bc6bbe5692d9805d5cce82c32b23162526ffc9f669a5568ad7b277585e0',
'0x2f96cabb5186496670e7ab1571cf7a1e903773ad92802e01a46c27c23e2e5ec6',
'0xc988df0c34373f741028ec04c0f9667a26fccdf222f3e06a7be5689e01a82588',
'0x266ba7d4b81dd007bb343e0222ea5a319684a7490ad1384d9b16de8aff072c25',
'0xf7aad3a6ffb003c9329f40baa9b1f1b8663489fe87dbd2fd3a06bf51e71f2eb4',
'0x4ad379ad4e3562b1f660f74593eea5267a14722191d57337100b4b9ffba2af36',
'0x134b469b276137463401ec6985414b29dfe2c34e3511d5660245ac50327da9d6',
'0x79dbc940f7bf5cc328752124d37b072f546f74b575915a9d6a0c05b37042ed26',
'0x29c5f0c5b256948697db5c242a422686b3a67dac694eeebb80f586c8d526d38f',
'0xa3761ff4f7b4e374a11ad6d503483d1c12e88efc4988e5d3880836f73aa1372c',
'0x9c2c56f98660085f2e77ece5794618f16b6668c25ae0bfeb6070f781836c9463',
'0xbeef95ae6aa008866cd2f1c9f904fc786afcb60456a5534219419f691c58e2f3',
'0xd5602b7d23b244d6b911879ce0d32186b8814504e2c8676bf0fad37dbf2ebc37',
'0x9aedf2e06832b962d97ac4902cf65d2973382ac5bdc2a13fb68d3b12933fa195',
'0x3a94b7d701a2e92644f6b383149f87277b29e018709d2630350c06de322fdd92',
'0x4af9785a0ab11fc8137505deb3f01fceeee45e9bf12e4b155809db7c9ebc1fae',
'0x7f3ea274ecab9ce20d9d1cc06ffcfb7e75c7b2eb296d7d44b2490d4359c6cf2b',
'0x6ce0ac9c98d1bbcee6612c553546351fdd869b52e2aed1c0e7a5104865744255',
'0xec2af69088731bfb0943b78c6003711e82f46ad1547d1cd411a7e2e0a1587acd',
'0x8398cd7e7b0ca6fc9af0cb8f7879d38fe18c81754bfaa916f4a1b988f1878329',
'0x4c03235962cb2b43320dfd0f1d648678e4672f2f32dfef4c8e274958a4e60208',
'0x867c1f91911d922205a7b63478cc2700d6f70a402b4ab0ba7f5a5753a0c731fd',
'0x684b620047bb8550c9dc9c62acdf3b2926c43ce1fd169c0dcc63b04e3359844c',
'0xf8ea90cecc01186193f3f90cef002588c1f7951009cdbf44807ab1851148d1b1',
'0x051f6978e5cb851027c2eb3560b5f2b41914c1d05e01ac1e9bf557d6d5573ced',
'0xe4f866b7fcb63e12b58913fef75607c1c4b72d32bbb5f1822139e7d0c640b2a5',
'0x1fa101f92b5206f2a2f11adbf4fc3bc869c54a05aff0c5f4b41e245607c2da31',
'0x729b2df7b3886131e3f8fa0016c2640033415620f56d1f4754984a6d72e20a34',
'0xb5a7328d3e56c1828f6d71a76fce3b5864dfa58b9c9904b17a71340d91063ef9',
'0x48fde65bd25537906d17958f634d9c8fa4126f9f266c334ae2fa98c19f5b7979',
'0x97b2816e83737a287e1627d181490d1f28dcd7fe9c3c1c5a9bb01d8d9957374e',
'0x07116e8bf95019a471eb219bf720c61a3adb4f7584bfb8a445d53a025c75bd8b',
'0x4eb4337b583883efd64d6040a08eb2f88e0c815a91b1569bedd91826b717c8fc',
'0xad536dd1bc044b79816bc4dca6bd0ceaf2456af6c050b095353353ecf88e9e7d',
'0x2a3df8178bf873971b9394ee5017a51c3e6ab4963ed9d04072c765a861002ae0',
'0xcfce033d6b12d953781541db3922339aef7bd2df6ed6678e7b49a86f07a4d508',
'0xa2adfe7bc4e5c9d42f825dc3aaed4f9c0e859c0e6505f194080f078f41b0b525',
'0x31d00260077dd46d0836b6dfdfdb16b26a0e5af8ffa9b12da1b1db991a1bff4c',
'0x02df130790f7809fda17107aed7d43f99d9bcf2746949c5603c1745915faf54b',
'0x497699f953d47a71188acf8e1facf37c6e5f341fa99d273370fdcb598b1a92bb',]

const ABI = [{
    "inputs": [
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      }
    ],
    "name": "setBuyerTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }];
abiDecoder.addABI(ABI);

async function f() {
    var balance = {}
    var total_count = 0
    for(i=0;i<transactions.length;i++){
        tx = await web3.eth.getTransaction(transactions[i])
        tx_inputs = await abiDecoder.decodeMethod(tx.input)

        if(balance.hasOwnProperty(tx_inputs.params[0].value)){
            total_count -= balance[tx_inputs.params[0].value]
            total_count += parseInt(tx_inputs.params[1].value)
        } else {
            total_count += parseInt(tx_inputs.params[1].value)
        }
        balance[tx_inputs.params[0].value] = tx_inputs.params[1].value
    }
    var sum = 0
    for(var i in balance){
        sum += parseInt(balance[i])
    }

    console.log(Object.keys(balance).length)
    console.log(total_count)
    console.log("sum calculated", sum.toString())

    var json = JSON.stringify(balance);
    fs.writeFile('balance.json', json, (err)=>{if(err){console.log(err)}})

    // Check total balance
    var balance_contract = {}
    for (i in balance){
        let b = await contract.methods._buyerTokens(i).call({from: web3.eth.defaultAccount})
        balance_contract[i] = b
    }

    var sum_contract = 0
    for(var i in balance_contract){
        sum_contract += parseInt(balance_contract[i])
    }
    console.log("sum contract", sum_contract.toString())

    var json_contract = JSON.stringify(balance_contract);
    fs.writeFile('balance_contract.json', json_contract, (err)=>{if(err){console.log(err)}})
 
}
f()

