const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");


contract("Buyer can withdraw over time - 1", function(accounts) {

  before("Set wallets", async function () {

    // Const
    const ownerAddress = accounts[0];
    const buyerAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Update buyer - 1M
    var result = await EnvoyTokenInstance.setBuyerTokens(buyerAddress, "1000000000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");
 });
  
 it("Buyer can withdraw over time - 1", async () => {

    // Const
    const buyerAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(buyerAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Withdraw initial 10%
    var result = await EnvoyTokenInstance.buyerWithdraw("100000" + "000000000000000000", {from: buyerAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(buyerAddress);
    assert.equal(result, "100000" + "000000000000000000", "Should have 100k tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.buyerWithdraw("1", {from: buyerAddress}),
      "Withdraw amount too high"
    );

    // Advance 4 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(175200));

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.buyerWithdraw("1", {from: buyerAddress}),
      "Withdraw amount too high"
    );

    // Advance 1 month + 1 minute
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43801));

    // Withdraw 50k
    var result = await EnvoyTokenInstance.buyerWithdraw("50000" + "000000000000000000", {from: buyerAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.buyerWithdraw("5" + "000000000000000000", {from: buyerAddress}),
      "Withdraw amount too high"
    );

    // Advance 17 months
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(744601));

    // Withdraw 750k
    var result = await EnvoyTokenInstance.buyerWithdraw("850000" + "000000000000000000", {from: buyerAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Advance 1 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.buyerWithdraw("1", {from: buyerAddress}),
      "Withdraw amount too high"
    );

  });

});

contract("Buyers can withdraw over time - 2", function(accounts) {

  before("Set wallets", async function () {

    // Const
    const buyerAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Update buyer - 1M
    var result = await EnvoyTokenInstance.setBuyerTokens(buyerAddress, "1000000000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");
  });

  it("Buyers can withdraw over time - 2", async () => {

    // Const
    const buyerAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    const totalTokens = 1000000;
    const initialTokens = 100000;
    const cliff = 4;
    const vesting = 18;

    for (let month = 0; month < 30; month++) {

      if (month == 0) {

        // Withdraw initial 10%
        var result = await EnvoyTokenInstance.buyerWithdraw(initialTokens + "000000000000000000", {from: buyerAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(buyerAddress);
        assert.equal(result, initialTokens + "000000000000000000", "Should have 1M tokens");

      } else if (month <= cliff) {

        // Can not withdraw yet
        await truffleAssert.reverts(
          EnvoyTokenInstance.buyerWithdraw("1", {from: buyerAddress}),
          "Withdraw amount too high"
        );

      } else if (month <= (cliff + vesting)) {

        let withdrawPerMonth = parseInt((totalTokens - initialTokens) / vesting) - 2;
        let withdrawTotal = parseInt(withdrawPerMonth * (month - cliff) + initialTokens);

        // Withdraw
        var result = await EnvoyTokenInstance.buyerWithdraw(withdrawPerMonth + "000000000000000000", {from: buyerAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(buyerAddress);
        assert.equal(result, withdrawTotal + "000000000000000000", "Should have tokens");

      } else if (month <= (cliff + vesting + 1)) {

        var result = await EnvoyTokenInstance.balanceOf(buyerAddress);
        var resultNoDecimals = parseInt(result) / 1000000000000000000;
        var tokensLeft = totalTokens - resultNoDecimals;

        // Withdraw
        var result = await EnvoyTokenInstance.buyerWithdraw(tokensLeft + "000000000000000000", {from: buyerAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(buyerAddress);
        assert.equal(result, totalTokens + "000000000000000000", "Should have all tokens");

      } else {

        // Can not withdraw anymore
        await truffleAssert.reverts(
          EnvoyTokenInstance.buyerWithdraw("1", {from: buyerAddress}),
          "Withdraw amount too high"
        );
      }

      // Advance 1 month
      await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    }

  });

});

contract("Only added buyer addresses can withdraw", function(accounts) {

  it("Only buyer address can withdraw", async () => {

    // Const
    const buyerAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.buyerWithdraw("1", {from: buyerAddress}),
      "Withdraw amount too high"
    );

  });

});

contract("Can not assign over 25M tokens", function(accounts) {

  it("Should not be possible to assign more than 25M tokens", async () => {

    // Const
    const buyerAddress1 = accounts[1];
    const buyerAddress2 = accounts[2];
    const buyerAddress3 = accounts[3];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Set to 20M first
    var result = await EnvoyTokenInstance.setBuyerTokens(buyerAddress1, "20000000" + "000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Overwrite 20M with 5M
    var result = await EnvoyTokenInstance.setBuyerTokens(buyerAddress1, "5000000" + "000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Set to 20M to second buyer
    var result = await EnvoyTokenInstance.setBuyerTokens(buyerAddress2, "20000000" + "000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Total is now 25M, so can not assign to 3th buyer
    await truffleAssert.reverts(
      EnvoyTokenInstance.setBuyerTokens(buyerAddress3, "1"),
      "Max amount reached"
    );
  });

});
