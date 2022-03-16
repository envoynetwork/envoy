const EnvoyToken = artifacts.require("EnvoyToken"); 
const EnvoyUnlocks = artifacts.require("EnvoyUnlocks"); 

module.exports = function(deployer) {
	deployer.deploy(EnvoyToken);
  deployer.deploy(EnvoyUnlocks);
};
