const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const EnvoyToken = artifacts.require("EnvoyToken");

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

    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Update wallets
    var result = await EnvoyTokenInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress);
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Only owner can update wallets
    await truffleAssert.reverts(
      EnvoyTokenInstance.updateWallets(publicSaleAddress, teamAddress, ecosystemAddress, reservesAddress, dexAddress, liquidityAddress, {from: teamAddress}),
      "Only owner can update wallets"
    );

  });

  it("Owner should be able to set up buyer wallets", async () => {

    // Const
    const ownerAddress = accounts[0];
    const buyerAddress = accounts[4];
    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Update buyer
    var result = await EnvoyTokenInstance.setBuyerTokens(buyerAddress, "1000000000000000000");
    assert.equal(result.receipt.status, true, "Transaction should succeed");

    // Only owner can update buyers
    await truffleAssert.reverts(
      EnvoyTokenInstance.setBuyerTokens(buyerAddress, "1000000000000000000", {from: buyerAddress}),
      "Only owner can set buyer tokens"
    );

  });

  it("Owner should be able to update owner", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];

    const EnvoyTokenInstance = await EnvoyToken.deployed();

    // Only owner can update owner
    await truffleAssert.reverts(
      EnvoyTokenInstance.updateOwner(userAddress, {from: userAddress}),
      "Only owner can update wallets"
    );

    // Update wallets
    var result = await EnvoyTokenInstance.updateOwner(ownerAddress);
    assert.equal(result.receipt.status, true, "Transaction should succeed");
  });

});
