// The ABI (Application Binary Interface) is the interface of the smart contract
import { abiToken } from './abi-token.js'

// Settings will be differ
import { webProvider, tokenAddress } from './settings.js'

const web3 = new Web3(window.ethereum);
const contractToken = new web3.eth.Contract(abiToken, tokenAddress);

var connectedWallet;

//
// ********************* PAGE SETUP *********************
//

export const loadPage = async () => {
  setupPage();
}

async function setupPage() {

  // Wallet button
  $("#b_connectWallet").click(function () {
    // First we need to check if a Web3 browser extension was found
    if (!window.ethereum) {
      alert("Web3 wallet not found");
    } else {
      connectWallet();
    }
  });

  // Add token to metamask
  $("#i_add_metamask").click(function () {
    addTokenToWallet();
  });

   // Update owner
   $("#o_set").click(function () {
    var owner = document.getElementById("o_owner").value;

    // Smart contract call
    contractToken.methods.updateOwner(owner).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Set owner result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Set owner error:");
      console.log(error);
    });
  });

  // Update wallets
  $("#w_set").click(function () {
    var publicSale = document.getElementById("w_publicSale").value;
    var team = document.getElementById("w_team").value;
    var ecosystem = document.getElementById("w_ecosystem").value;
    var reserves = document.getElementById("w_reserves").value;
    var dex = document.getElementById("w_dex").value;
    var liq = document.getElementById("w_liq").value;

    // Smart contract call
    contractToken.methods.updateWallets(publicSale, team, ecosystem, reserves, dex, liq).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Set wallets result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Set wallets error:");
      console.log(error);
    });
  });

  // Set buyer info
  $("#b_buyer").click(function () {
    var address = document.getElementById("b_address").value;
    var amount = document.getElementById("b_amount").value;

    // Smart contract call
    contractToken.methods.setBuyerTokens(address, amount).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Set result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Set error:");
      console.log(error);
    });
  });

  // Get buyer info
  $("#bi_buyer").click(function () {
    var address = document.getElementById("bi_address").value;

    contractToken.methods._buyerTokens(address).call().then(function (result, error) {
      $("#bi_info").html(result);
    });

    contractToken.methods._walletTokensWithdrawn("privatesale", address).call().then(function (result, error) {
      $("#bi_withdraw").html(result);
    });

  });

  // Withdraw
  $("#w1_withdraw").click(function () {
    var amount = document.getElementById("w1_amount").value;

    contractToken.methods.publicSaleWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });
  $("#w2_withdraw").click(function () {
    var amount = document.getElementById("w2_amount").value;

    contractToken.methods.teamWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });
  $("#w3_withdraw").click(function () {
    var amount = document.getElementById("w3_amount").value;

    contractToken.methods.ecosystemWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });
  $("#w4_withdraw").click(function () {
    var amount = document.getElementById("w4_amount").value;

    contractToken.methods.reservesWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });
  $("#w5_withdraw").click(function () {
    var amount = document.getElementById("w5_amount").value;

    contractToken.methods.dexWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });
  $("#w6_withdraw").click(function () {
    var amount = document.getElementById("w6_amount").value;

    contractToken.methods.liqWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });
  $("#w7_withdraw").click(function () {
    var amount = document.getElementById("w7_amount").value;

    contractToken.methods.buyerWithdraw(amount).send({ from: connectedWallet }).then(function (result, error) {
      console.log("Withdraw result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Withdraw error:");
      console.log(error);
    });
  });

  loadInfo();
}


//
// ********************* SETUP WALLET *********************
//

async function addTokenToWallet() {
  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: "ENV",
          decimals: 18,
          image: "https://envoy.art/_nuxt/img/header-logo.53658de.svg",
        },
      },
    });
    console.log("Was token added to MM: " + wasAdded);
  } catch (error) {
    console.log(error);
  }
}

async function connectWallet() {

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedWallet = accounts[0];
    $("#i_wallet_address").html(connectedWallet);

    // Network to which MetaMask is connected
    let connectedNetwork = window.ethereum.networkVersion;
    if (connectedNetwork == "1") {
      $("#i_network_name").html("Ethereum Mainnet");
    } else if (connectedNetwork == "4") {
      $("#i_network_name").html("Rinkeby Testnet");
    } else if (connectedNetwork == "5") {
      $("#i_network_name").html("Goerli Testnet");
    } else {
      $("#i_network_name").html("Unknown: " + connectedNetwork);
    }

    // Visual
    var buttonConnect = document.getElementById("b_connectWallet");
    buttonConnect.style.display = "none";

    var blockSetters = document.getElementById("d_connectWallet");
    blockSetters.style.display = "";

    var blockSetters = document.getElementById("d_buyers");
    blockSetters.style.display = "";

    contractToken.methods.balanceOf(connectedWallet).call().then(function (result, error) {
      console.log("result: ", result);
      console.log("error: ", error);
      $("#i_token_balance").html(result);
    });
    
  } catch (error) {
    if (error.code === 4001) {
      // User rejected request
    }
    console.error(error);
  }

}

function loadInfo() {

  contractToken.methods.totalSupply().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_token_supply").html(result);
  });
  contractToken.methods._totalBuyerTokens().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_totalBuyerTokens").html(result);
  });

  contractToken.methods._ownerWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_ownerWallet").html(result);
  });
  contractToken.methods._publicSaleWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_publicSaleWallet").html(result);
  });
  contractToken.methods._teamWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_teamWallet").html(result);
  });
  contractToken.methods._ecosystemWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_ecosystemWallet").html(result);
  });
  contractToken.methods._reservesWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_reserveWallet").html(result);
  });
  contractToken.methods._dexWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_dexWallet").html(result);
  });
  contractToken.methods._liqWallet().call().then(function (result, error) {
    console.log("result: ", result);
    console.log("error: ", error);
    $("#i_liqWallet").html(result);
  });

}
