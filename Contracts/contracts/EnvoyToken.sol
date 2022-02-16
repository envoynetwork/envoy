pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract EnvoyToken is ERC20, Ownable {

  using SafeMath for uint256;

  //
  // ******************* VARIABLES *******************
  //



  //
  // ******************* SETUP *******************
  //

  constructor () public ERC20("Envoy", "ENV") {

  }

  function mintForUnlocksContract(address unlocksContract) external onlyOwner {

    // Mint 100M tokens for unlocks contract
    _mint(unlocksContract, 100000000000000000000000000);
  }


}
