const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("Team can withdraw 20M over time - 1", function(accounts) {

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
  
 it("Team should be able to withdraw 20M over time - 1", async () => {

    // Const
    const teamAddress = accounts[2];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(teamAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Advance 6 months
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(262800));

    // Can not withdraw yet
    await truffleAssert.reverts(
      EnvoyTokenInstance.teamWithdraw("1", {from: teamAddress}),
      "Withdraw amount too high"
    );

    // Advance 1 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    // Withdraw
    var result = await EnvoyTokenInstance.teamWithdraw("1000000" + "000000000000000000", {from: teamAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(teamAddress);
    assert.equal(result, "1000000" + "000000000000000000", "Should have 1M tokens");

    // Advance 17 months + 1 minute
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(744602));

    // Withdraw
    var result = await EnvoyTokenInstance.teamWithdraw("19000000" + "000000000000000000", {from: teamAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(teamAddress);
    assert.equal(result, "20000000" + "000000000000000000", "Should have 20M tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.teamWithdraw("1", {from: teamAddress}),
      "Withdraw amount too high"
    );

  });

});

contract("Team can withdraw 20M over time - 2", function(accounts) {

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

  it("Team should be able to withdraw 20M over time - 2", async () => {

    // Const
    const teamAddress = accounts[2];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    const totalTokens = 20000000;
    const cliff = 6;
    const vesting = 18;

    for (let month = 0; month < 30; month++) {

      if (month <= cliff) {

        // Can not withdraw yet
        await truffleAssert.reverts(
          EnvoyTokenInstance.teamWithdraw("1", {from: teamAddress}),
          "Withdraw amount too high"
        );

      } else if (month <= (cliff + vesting)) {

        let withdrawPerMonth = parseInt(totalTokens / vesting) - 2;
        let withdrawTotal = parseInt(withdrawPerMonth * (month - cliff));

        // Withdraw
        var result = await EnvoyTokenInstance.teamWithdraw(withdrawPerMonth + "000000000000000000", {from: teamAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(teamAddress);
        assert.equal(result, withdrawTotal + "000000000000000000", "Should have tokens");

      } else if (month <= (cliff + vesting + 1)) {

        var result = await EnvoyTokenInstance.balanceOf(teamAddress);
        var resultNoDecimals = parseInt(result) / 1000000000000000000;
        var tokensLeft = totalTokens - resultNoDecimals;

        // Withdraw
        var result = await EnvoyTokenInstance.teamWithdraw(tokensLeft + "000000000000000000", {from: teamAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(teamAddress);
        assert.equal(result, totalTokens + "000000000000000000", "Should have all tokens");

      } else {

        // Can not withdraw anymore
        await truffleAssert.reverts(
          EnvoyTokenInstance.teamWithdraw("1", {from: teamAddress}),
          "Withdraw amount too high"
        );
      }

      // Advance 1 month
      await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    }

  });

});

contract("Only team address can withdraw for team wallet", function(accounts) {

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

  it("Only team address can withdraw for team wallet", async () => {

    // Const
    const userAddress = accounts[0];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.teamWithdraw("1", {from: userAddress}),
      "Unauthorized team wallet"
    );

  });

});
