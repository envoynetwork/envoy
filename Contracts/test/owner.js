const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");
const EnvoyUnlocks = artifacts.require("EnvoyUnlocks");

contract("Owner can set up wallets", function(accounts) {

  it("Owner should be able to set up wallets", async () => {

    // Const
    const ownerAddress = accounts[0];
    const publicSaleAddress = accounts[1];
    const teamAddress = accounts[2];
    const ecosystemAddress = accounts[3];
    const reservesAddress = accounts[4];
    const dexAddress = accounts[5];
    const liquidityAddress = accounts[6];

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    const EnvoyUnlocksInstance = await EnvoyUnlocks.deployed();

    // Update wallets
    var result = await EnvoyUnlocksInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress);
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(zeroAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress),
      "Should not set zero address"
    );
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(publicSaleAddress, zeroAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress),
      "Should not set zero address"
    );
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(publicSaleAddress, teamAddress, zeroAddress, reservesAddress, dexAddress, liquidityAddress),
      "Should not set zero address"
    );
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, zeroAddress, dexAddress, liquidityAddress),
      "Should not set zero address"
    );
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, zeroAddress, liquidityAddress),
      "Should not set zero address"
    );
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, zeroAddress),
      "Should not set zero address"
    );

    // Only owner can update wallets
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress, {from: teamAddress}),
      "Ownable: caller is not the owner."
    );

  });

  it("Owner should be able to set up buyer wallets", async () => {

    // Const
    const ownerAddress = accounts[0];
    const buyerAddress = accounts[4];
    const EnvoyUnlocksInstance = await EnvoyUnlocks.deployed();

    // Update buyer
    var result = await EnvoyUnlocksInstance.setBuyerTokens(buyerAddress, "1000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Only owner can update buyers
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.setBuyerTokens(buyerAddress, "1000000000000000000", {from: buyerAddress}),
      "Ownable: caller is not the owner."
    );

  });

  it("Owner should be able to update owner", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];

    const EnvoyUnlocksInstance = await EnvoyUnlocks.deployed();

    // Only owner can update owner
    await truffleAssert.reverts(
      EnvoyUnlocksInstance.transferOwnership(userAddress, {from: userAddress}),
      "Ownable: caller is not the owner"
    );

    // Update wallets
    var result = await EnvoyUnlocksInstance.transferOwnership(ownerAddress);
    assert.equal(result.receipt.status, true, "Transaction should succeed");
  });

});


contract("Withdraw all tokens", function(accounts) {

  before("Set wallets", async function () {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
 
    const EnvoyUnlocksInstance = await EnvoyUnlocks.deployed();

    // Update wallets
    var result = await EnvoyUnlocksInstance.updateWallets(userAddress, userAddress, userAddress, userAddress, userAddress, userAddress);
    assert.equal(result.receipt.status, true, "Transaction should succeed");
 });

  it("Unlock and withdraw all", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();
    const EnvoyUnlocksInstance = await EnvoyUnlocks.deployed();

    // Setup
    EnvoyTokenInstance.mintForUnlocksContract(EnvoyUnlocksInstance.address);
    EnvoyUnlocksInstance.setup(EnvoyTokenInstance.address);

    // All 25M tokens for buyer
    var result = await EnvoyUnlocksInstance.setBuyerTokens(userAddress, "25000000" + "000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // All tokens are unlocked
    await truffleHelpers.time.increase(truffleHelpers.time.duration.weeks(150));

    // Withdraw 1M for public sale
    var result = await EnvoyUnlocksInstance.publicSaleWithdraw("1000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Withdraw 20M for team
    var result = await EnvoyUnlocksInstance.teamWithdraw("20000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Withdraw 25M for ecosystem
    var result = await EnvoyUnlocksInstance.ecosystemWithdraw("25000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Withdraw 20M for reserve
    var result = await EnvoyUnlocksInstance.reservesWithdraw("20000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Withdraw 2M for dex
    var result = await EnvoyUnlocksInstance.dexWithdraw("2000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Withdraw 7M for liquidity incentives
    var result = await EnvoyUnlocksInstance.liqWithdraw("7000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Withdraw 25M for private sale buyer
    var result = await EnvoyUnlocksInstance.buyerWithdraw("25000000" + "000000000000000000", {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Balance
    var result = await EnvoyTokenInstance.balanceOf(userAddress);
    assert.equal(result, "100000000" + "000000000000000000", "Should have 100M tokens");
  });

});
