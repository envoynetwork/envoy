const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("Ecosystem can withdraw 25M over time - 1", function(accounts) {

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
  
 it("Ecosystem should be able to withdraw 25M over time - 1", async () => {

    // Const
    const ecosystemAddress = accounts[3];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
    assert.equal(result, 0, "Should not have tokens yet");

    // Withdraw initial 5%
    var result = await EnvoyTokenInstance.ecosystemWithdraw("1250000" + "000000000000000000", {from: ecosystemAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Advance 1 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    // Can not withdraw yet
    await truffleAssert.reverts(
      EnvoyTokenInstance.ecosystemWithdraw("1", {from: ecosystemAddress}),
      "Withdraw amount too high"
    );

    // Advance 1 month
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43801));

    // Withdraw
    var result = await EnvoyTokenInstance.ecosystemWithdraw("1250000" + "000000000000000000", {from: ecosystemAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
    assert.equal(result, "2500000" + "000000000000000000", "Should have 2.5M tokens");

    // Advance 20 months + 1 minute
    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(876002));

    // Withdraw
    var result = await EnvoyTokenInstance.ecosystemWithdraw("22500000" + "000000000000000000", {from: ecosystemAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
    assert.equal(result, "25000000" + "000000000000000000", "Should have 25M tokens");

    // Can not withdraw more
    await truffleAssert.reverts(
      EnvoyTokenInstance.ecosystemWithdraw("1", {from: ecosystemAddress}),
      "Withdraw amount too high"
    );

  });

});

contract("Ecosystem can withdraw 25M over time - 2", function(accounts) {

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

  it("Ecosystem should be able to withdraw 25M over time - 2", async () => {

    // Const
    const ecosystemAddress = accounts[3];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    const initialTokens = 1250000;
    const totalTokens = 25000000 - initialTokens;
    const cliff = 1;
    const vesting = 19;

    for (let month = 0; month < 21; month++) {

      if (month == 0) {

        // Withdraw initial 10%
        var result = await EnvoyTokenInstance.ecosystemWithdraw(initialTokens + "000000000000000000", {from: ecosystemAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
        assert.equal(result, initialTokens + "000000000000000000", "Should have 1M tokens");

      } else if (month <= cliff) {

        // Can not withdraw yet
        await truffleAssert.reverts(
          EnvoyTokenInstance.ecosystemWithdraw("1", {from: ecosystemAddress}),
          "Withdraw amount too high"
        );

      } else if (month <= (cliff + vesting)) {

        let withdrawPerMonth = parseInt((totalTokens - initialTokens) / vesting) - 2;
        let withdrawTotal = parseInt(withdrawPerMonth * (month - cliff) + initialTokens);

        // Withdraw
        var result = await EnvoyTokenInstance.ecosystemWithdraw(withdrawPerMonth + "000000000000000000", {from: ecosystemAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
        assert.equal(result, withdrawTotal + "000000000000000000", "Should have tokens");

      } else if (month <= (cliff + vesting + 1)) {

        var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
        var resultNoDecimals = parseInt(result) / 1000000000000000000;
        var tokensLeft = totalTokens - resultNoDecimals;

        // Withdraw
        var result = await EnvoyTokenInstance.ecosystemWithdraw(tokensLeft + "000000000000000000", {from: ecosystemAddress});
        assert.equal(result.receipt.status, true, "Transaction should succeed");

        // Balance
        var result = await EnvoyTokenInstance.balanceOf(ecosystemAddress);
        assert.equal(result, totalTokens + "000000000000000000", "Should have all tokens");

      } else {

        // Can not withdraw anymore
        await truffleAssert.reverts(
          EnvoyTokenInstance.ecosystemWithdraw("1", {from: ecosystemAddress}),
          "Withdraw amount too high"
        );
      }

      // Advance 1 month
      await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(43800));

    }

  });

});

contract("Only ecosystem address can withdraw for ecosystem wallet", function(accounts) {

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

  it("Only ecosystem address can withdraw for ecosystem wallet", async () => {

    // Const
    const userAddress = accounts[0];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    await truffleAssert.reverts(
      EnvoyTokenInstance.ecosystemWithdraw("1", {from: userAddress}),
      "Unauthorized ecosystem wallet"
    );

  });

});