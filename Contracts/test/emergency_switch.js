const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");
const EnvoyUnlocks = artifacts.require("EnvoyUnlocks");

contract("Owner can toggle emergency switch", function(accounts) {

  before("Setup", async function () {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];

    const EnvoyTokenInstance = await EnvoyToken.deployed();
    const EnvoyUnlocksInstance = await EnvoyUnlocks.deployed();

    // Setup
    await EnvoyTokenInstance.mintForUnlocksContract(EnvoyUnlocksInstance.address);
    await EnvoyUnlocksInstance.setup(EnvoyTokenInstance.address);

    // Update wallets
    var result = await EnvoyUnlocksInstance.updateWallets(userAddress, userAddress, userAddress, userAddress, userAddress, userAddress);
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Get tokens
    var result = await EnvoyUnlocksInstance.dexWithdraw(web3.utils.toWei("100"), {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");
  });

  it("Owner can toggle emergency switch", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];

    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Get toggle
    var result = await EnvoyTokenInstance._emergencySwitch();
    assert.equal(result, false, "Emergency switch is off");

    // Toggle on
    result = await EnvoyTokenInstance.toggleEmergencySwitch();
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Get toggle
    var result = await EnvoyTokenInstance._emergencySwitch();
    assert.equal(result, true, "Emergency switch is on");

    // Toggle off
    result = await EnvoyTokenInstance.toggleEmergencySwitch();
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Get toggle
    result = await EnvoyTokenInstance._emergencySwitch();
    assert.equal(result, false, "Emergency switch is off");

    // Only owner can toggle
    await truffleAssert.reverts(
      EnvoyTokenInstance.toggleEmergencySwitch({from: userAddress}),
      "Ownable: caller is not the owner."
    );

  });

  it("Can not transfer tokens when emergency switch is on", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];

    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // User balance
    result = await EnvoyTokenInstance.balanceOf(userAddress);
    assert.equal(result.toString(), web3.utils.toWei("100"), "Should have 100 ENV tokens");

    // Transfer
    result = await EnvoyTokenInstance.transfer(ownerAddress, web3.utils.toWei("10"), {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // User balance
    result = await EnvoyTokenInstance.balanceOf(userAddress);
    assert.equal(result.toString(), web3.utils.toWei("90"), "Should have 90 ENV tokens");

    // Toggle on
    result = await EnvoyTokenInstance.toggleEmergencySwitch();
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Can not ransfer
    await truffleAssert.reverts(
      EnvoyTokenInstance.transfer(ownerAddress, web3.utils.toWei("1"), {from: userAddress}),
      "Emergency switch is on"
    );

    // Toggle off
    result = await EnvoyTokenInstance.toggleEmergencySwitch();
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Transfer
    result = await EnvoyTokenInstance.transfer(ownerAddress, web3.utils.toWei("10"), {from: userAddress});
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // User balance
    result = await EnvoyTokenInstance.balanceOf(userAddress);
    assert.equal(result.toString(), web3.utils.toWei("80"), "Should have 80 ENV tokens");

  });

});
