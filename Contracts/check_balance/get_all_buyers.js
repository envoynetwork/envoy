const Web3 = require('web3')
const abiDecoder = require('abi-decoder');
const fs = require('fs');
const abi = require('../build/contracts/EnvoyToken.json')
const xlsx = require('node-xlsx')
const converter = require('json-2-csv');

const parseArgs = require('minimist')
const argv = parseArgs(process.argv, {boolean: ['help', 'h'], default: {'file': 'input/export_etherscan.csv'}})

// Connect to mainnet
const infuraKey = fs.readFileSync("../.infuraKey").toString().trim();
if(infuraKey === '' || infuraKey === undefined){
  console.error("Add a '.infuraKey' file containing the infura key to this folder")
}

const webProvider = "https://mainnet.infura.io/v3/"+infuraKey;
const web3 = new Web3(webProvider);

// Load account to use
const privateKey = fs.readFileSync("../.secret").toString().trim();
if(privateKey === '' || privateKey === undefined){
  console.error("Add a '.secret' file containing the private key to this folder")
}
var account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);

web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Load contract
const contract = new web3.eth.Contract(abi.abi, "0xf1d1a5306daae314af6c5d027a492b313e07e1a0");
abiDecoder.addABI(abi.abi);


async function generateReport(file) {
  
    // Load export with transactions
    const workSheetsFromFile = xlsx.parse(file);
    var transactions = []
    for(i in workSheetsFromFile[0]['data']){
        if (['Buyer Withdraw',
            'Set Buyer Tokens',
            'Public Sale Withdraw',
            'Liq Withdraw',
            'Dex Withdraw',
            'Reserves Withdraw', 
            'Team Withdraw',
            'Ecosystem Withdraw'].includes(workSheetsFromFile[0]['data'][i][15])){
          transactions.push(workSheetsFromFile[0]['data'][i][0])
        } 
    }

    // Initiate output JSON
    var balance = {}
    balance['buyerWithdraw'] = {}
    balance['publicSaleWithdraw'] = {}
    balance['liqWithdraw'] = {}
    balance['dexWithdraw'] = {}
    balance['reservesWithdraw'] = {} 
    balance['teamWithdraw'] = {}
    balance['ecosystemWithdraw'] = {}

    // Calculate balances
    var total_count = 0
    for(i=0;i<transactions.length;i++){
        let tx = await web3.eth.getTransaction(transactions[i])
        let tx_inputs = await abiDecoder.decodeMethod(tx.input)
        if(tx_inputs.name == 'setBuyerTokens'){
          if(balance['buyerWithdraw'].hasOwnProperty(tx_inputs.params[0].value.toLowerCase())){
              total_count -= balance['buyerWithdraw'][tx_inputs.params[0].value.toLowerCase()]['allowed_transaction']
              total_count += parseInt(tx_inputs.params[1].value)
          } else {
              balance['buyerWithdraw'][tx_inputs.params[0].value.toLowerCase()] = {'allowed_transactions': 0, 'claimed_transactions': 0}
              total_count += parseInt(tx_inputs.params[1].value)
          }
          balance['buyerWithdraw'][tx_inputs.params[0].value.toLowerCase()]['allowed_transactions'] = tx_inputs.params[1].value
        } else if (tx_inputs.name in balance){
          if(!balance[tx_inputs.name].hasOwnProperty(tx.from.toLowerCase())){
            balance[tx_inputs.name][tx.from.toLowerCase()] = {'allowed_transactions': 0, 'claimed_transactions': 0}
          }
          balance[tx_inputs.name][tx.from.toLowerCase()]['claimed_transactions'] = web3.utils.toBN(balance[tx_inputs.name][tx.from.toLowerCase()]['claimed_transactions']).add(web3.utils.toBN(tx_inputs.params[0].value)).toString()          
        } else {
          console.log(`${tx_inputs.name} is not defined!`)
        }
    }

    // Log results
    for(bal in balance){
        var allowed = 0
        var claimed = 0
        for(var i in balance[bal]){
          allowed += parseInt(balance[bal][i]['allowed_transactions'])
          claimed += parseInt(balance[bal][i]['claimed_transactions'])
          }

        console.log(`Total tokens in supply via ${bal} (by ${Object.keys(balance[bal]).length} addresses)`, claimed.toString())
        if(bal === 'buyerWithdraw'){console.log(`Total allowed tokens: ${allowed}`)}

      }

    // Construct timestamp
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    const datestring =  `${year}${month}${day}`

    // Construct JSON in output format
    var balance_for_report = {}
    for (outerKey in balance){
        for(innerKey in balance[outerKey]){
          balance_for_report[innerKey + outerKey] = {'address': innerKey,
                                                    'type': outerKey,
                                                    'allowed in private sale': balance[outerKey][innerKey]['allowed_transactions'],
                                                    'total claimed': balance[outerKey][innerKey]['claimed_transactions'],
                                                    'current total token balance': (await contract.methods.balanceOf(innerKey).call()).toString()}
        }
    }
    var json_contract = JSON.stringify(balance_for_report);
    fs.writeFile(`output/balances_${datestring}.json`, json_contract, (err)=>{if(err){console.log(err)}})

    // Write report to CSV
    converter.json2csv(Object.values(balance_for_report), (err, csv) => {
        if (err) {
            throw err;
        }
        fs.writeFileSync(`output/report_${datestring}.csv`, csv);
    });
  
}  


if(argv.help || argv.h){
    console.log(
        "\nFunction to generate a report of the released tokens in circulation.\n",
        "Options:\n",
        "--file: Location of the Excel file with Etherscan export. This should be downloaded manually.\n",
        "Defaults to 'export_etherscan.csv' in this folder",
        
    )
} else {
    generateReport(argv.file)
}