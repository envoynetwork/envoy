const EnvoyToken = artifacts.require("EnvoyToken"); 

module.exports = function(deployer) {
	deployer.deploy(EnvoyToken, "ENVOY", "ENV");
};
