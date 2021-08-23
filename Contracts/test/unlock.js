const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

contract("Unlock without initial or cliff", function(accounts) {

  it("Unlock without initial or cliff", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 0, 100, 1000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 0, 100, 1000);
    assert.equal(result, 10, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(100));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 0, 100, 1000);
    assert.equal(result, 1000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 0, 100, 1000);
    assert.equal(result, 1000, "Withdraw amount should be correct");

  });

});

contract("Unlock without initial", function(accounts) {

  it("Unlock without initial", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 10, 100, 1000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(10));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 10, 100, 1000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 10, 100, 1000);
    assert.equal(result, 10, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(100));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 10, 100, 1000);
    assert.equal(result, 1000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 0, 10, 100, 1000);
    assert.equal(result, 1000, "Withdraw amount should be correct");

  });

});

contract("Unlock", function(accounts) {

  it("Unlock", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 100, 1000000);
    assert.equal(result, 50000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(10));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 100, 1000000);
    assert.equal(result, 50000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 100, 1000000);
    assert.equal(result, 59500, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(100));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 100, 1000000);
    assert.equal(result, 1000000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 100, 1000000);
    assert.equal(result, 1000000, "Withdraw amount should be correct");

  });

});

contract("Unlock no cliff", function(accounts) {

  it("Unlock no cliff", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 0, 100, 1000000);
    assert.equal(result, 50000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 0, 100, 1000000);
    assert.equal(result, 59500, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(100));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 0, 100, 1000000);
    assert.equal(result, 1000000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 0, 100, 1000000);
    assert.equal(result, 1000000, "Withdraw amount should be correct");

  });

});

contract("Unlock no vesting", function(accounts) {

  it("Unlock no vesting", async () => {

    // Const
    const userAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 1, 1000000);
    assert.equal(result, 50000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 1, 1000000);
    assert.equal(result, 50000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(10));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 1, 1000000);
    assert.equal(result, 1000000, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(userAddress, 5, 10, 1, 1000000);
    assert.equal(result, 1000000, "Withdraw amount should be correct");

  });

});

contract("Unlock with withdrawals - 1", function(accounts) {

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

  it("Unlock with withdrawals - 1", async () => {

    // Const
    const publicSaleAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 0, 0, 100, 1000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(1));
    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 0, 0, 100, 1000);
    assert.equal(result, 10, "Withdraw amount should be correct");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw(10, {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 0, 0, 100, 1000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(100));
    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 0, 0, 100, 1000);
    assert.equal(result, 990, "Withdraw amount should be correct");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw(900, {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 0, 0, 100, 1000);
    assert.equal(result, 90, "Withdraw amount should be correct");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw(90, {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 0, 0, 100, 1000);
    assert.equal(result, 0, "Withdraw amount should be correct");

  });

});

contract("Unlock with withdrawals - 2", function(accounts) {

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

  it("Unlock with withdrawals - 2", async () => {

    // Const
    const publicSaleAddress = accounts[1];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 5, 10, 100, 1000000);
    assert.equal(result, 50000, "Withdraw amount should be correct");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw(50000, {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 5, 10, 100, 1000000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(10));
    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 5, 10, 100, 1000000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(10));
    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 5, 10, 100, 1000000);
    assert.equal(result, 95000, "Withdraw amount should be correct");

    // Withdraw
    var result = await EnvoyTokenInstance.publicSaleWithdraw(95000, {from: publicSaleAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 5, 10, 100, 1000000);
    assert.equal(result, 0, "Withdraw amount should be correct");

    await truffleHelpers.time.increase(truffleHelpers.time.duration.minutes(100));
    var result = await EnvoyTokenInstance.walletCanWithdraw(publicSaleAddress, 5, 10, 100, 1000000);
    assert.equal(result, 855000, "Withdraw amount should be correct");

  });

});
