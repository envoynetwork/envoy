const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("Liquidity wallet can withdraw 7M over time - 1", function(accounts) {

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
  
 it("Liquidity wallet should be able to withdraw 7M over time - 1", async () => {

    // Const
    const liquidityAddress = accounts[6];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Withdraw initial 40%
    var result = await EnvoyTokenInstance.liqWithdraw("2800000" + "000000000000000000", {from: liquidityAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Advance 1 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    // Can not withdraw yet
    await truffleAssert.reverts(
      EnvoyTokenInstance.liqWithdraw("1", {from: liquidityAddress}),
      "Withdraw amount too high"
    );

    // Advance 1 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43801));

    // Withdraw
    var result = await EnvoyTokenInstance.liqWithdraw("700000" + "000000000000000000", {from: liquidityAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
    assert.equal(result, "3500000" + "000000000000000000", "Should have 3.5M tokens");

    // Advance 5 months + 1 minute
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(219001));

    // Withdraw
    var result = await EnvoyTokenInstance.liqWithdraw("3500000" + "000000000000000000", {from: liquidityAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
    assert.equal(result, "7000000" + "000000000000000000", "Should have 7M tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.liqWithdraw("1", {from: liquidityAddress}),
      "Withdraw amount too high"
    );

  });

});

contract("Liquidity wallet can withdraw 7M over time - 2", function(accounts) {

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

  it("Liquidity wallet should be able to withdraw 7M over time - 2", async () => {

    // Const
    const liquidityAddress = accounts[6];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    const initialTokens = 2800000;
    const totalTokens = 7000000;
    const cliff = 1;
    const vesting = 6;

    for (let month = 0; month < 21; month++) {

      if (month == 0) {

        // Withdraw initial 40%
        var result = await EnvoyTokenInstance.liqWithdraw(initialTokens + "000000000000000000", {from: liquidityAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
        assert.equal(result, initialTokens + "000000000000000000", "Should have 1M tokens");

        // Can not withdraw more
        await truffleAssert.reverts(
          EnvoyTokenInstance.liqWithdraw("1", {from: liquidityAddress}),
          "Withdraw amount too high"
        );

      } else if (month == 1) {

          // Can not withdraw more
          await truffleAssert.reverts(
            EnvoyTokenInstance.liqWithdraw("1", {from: liquidityAddress}),
            "Withdraw amount too high"
          );

      } else if (month <= (cliff + vesting)) {

        let withdrawPerMonth = parseInt((totalTokens - initialTokens) / vesting) - 2;
        let withdrawTotal = parseInt(withdrawPerMonth * (month - cliff) + initialTokens);

        // Withdraw
        var result = await EnvoyTokenInstance.liqWithdraw(withdrawPerMonth + "000000000000000000", {from: liquidityAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
        assert.equal(result, withdrawTotal + "000000000000000000", "Should have tokens");

      } else if (month <= (cliff + vesting + 1)) {

        var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
        var resultNoDecimals = parseInt(result) / 1000000000000000000;
        var tokensLeft = totalTokens - resultNoDecimals;

        // Withdraw
        var result = await EnvoyTokenInstance.liqWithdraw(tokensLeft + "000000000000000000", {from: liquidityAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(liquidityAddress);
        assert.equal(result, totalTokens + "000000000000000000", "Should have all tokens");

      } else {

        // Can not withdraw anymore
        await truffleAssert.reverts(
          EnvoyTokenInstance.liqWithdraw("1", {from: liquidityAddress}),
          "Withdraw amount too high"
        );
      }

      // Advance 1 month
      await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    }

  });

});

contract("Only liquidity address can withdraw for liquidity wallet", function(accounts) {

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

  it("Only liquidity address can withdraw for liquidity wallet", async () => {

    // Const
    const userAddress = accounts[0];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.liqWithdraw("1", {from: userAddress}),
      "Unauthorized liquidity incentives wallet"
    );

  });

});