const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("Liquidity wallet can withdraw 7M immediately", function(accounts) {

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

  it("Only liquidity address can withdraw liquidity tokens", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.liqWithdraw("1", {from: userAddress}),
      "Unauthorized liquidity incentives wallet"
    );

  });

  it("Liquidity wallet can withdraw 7M immediately", async () => {

    // Const
    const liquidityAddress = accounts[6];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Withdraw
    var result = await EnvoyTokenInstance.liqWithdraw("1000000" + "000000000000000000", {from: liquidityAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
    assert.equal(result, "1000000" + "000000000000000000", "Should have 1M tokens");

    // Withdraw
    var result = await EnvoyTokenInstance.liqWithdraw("6000000" + "000000000000000000", {from: liquidityAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
    assert.equal(result, "7000000" + "000000000000000000", "Should have all 7M tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.liqWithdraw("1", {from: liquidityAddress}),
      "Withdraw amount too high"
    );

  });

});
