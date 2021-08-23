const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("DEX wallet can withdraw 2M immediately", function(accounts) {

  before("Set wallets", async function () {

     // Const
     const ownerAddress = accounts[0];
     const publicSaleAddress = accounts[1];
     const teamAddress = accounts[2];
     const ecosystemAddress = accounts[3];
     const reservesAddress = accounts[4];
     const dexAddress = accounts[5];
     const liquidityAddress = accounts[6];
  
     const EnvoyTokenInstance = await EnvoyToken.deployed();

     // Update wallets
     var result = await EnvoyTokenInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress);
     assert.equal(result.receipt.status, true, "Transaction should succeed");
  });

  it("Only DEX address can withdraw DEX tokens", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.dexWithdraw("1", {from: userAddress}),
      "Unauthorized dex wallet"
    );

  });

  it("DEX wallet can withdraw 2M immediately", async () => {

    // Const
    const dexAddress = accounts[5];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(dexAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Withdraw
    var result = await EnvoyTokenInstance.dexWithdraw("1000000" + "000000000000000000", {from: dexAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(dexAddress);
    assert.equal(result, "1000000" + "000000000000000000", "Should have 1M tokens");

    // Withdraw
    var result = await EnvoyTokenInstance.dexWithdraw("1000000" + "000000000000000000", {from: dexAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(dexAddress);
    assert.equal(result, "2000000" + "000000000000000000", "Should have all 2M tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.dexWithdraw("1", {from: dexAddress}),
      "Withdraw amount too high"
    );

  });

});
