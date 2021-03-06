const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("Public sale wallet can withdraw 1M immediately", function(accounts) {

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

  it("Only public sale address can withdraw public sale tokens", async () => {

    // Const
    const userAddress = accounts[0];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.publicSaleWithdraw("1", {from: userAddress}),
      "Unauthorized public sale wallet"
    );

  });

  it("Public sale wallet can withdraw 1M immediately", async () => {

    // Const
    const publicSaleAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(publicSaleAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw("100000" + "000000000000000000", {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(publicSaleAddress);
    assert.equal(result, "100000" + "000000000000000000", "Should have 100k tokens");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw("900000" + "000000000000000000", {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(publicSaleAddress);
    assert.equal(result, "1000000" + "000000000000000000", "Should have all 1M tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.publicSaleWithdraw("1", {from: publicSaleAddress}),
      "Withdraw amount too high"
    );

  });


});
