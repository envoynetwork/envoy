pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract EnvoyToken is ERC20 {

  using SafeMath for uint256;

  //
  // ******************* VARIABLES *******************
  //

  // Deploy time
  uint256 private _deployTime = block.timestamp;

  // Contract owner
  address public _ownerWallet;

  // Public sale - 1M
  address public _publicSaleWallet;
  // Team - 20M
  address public _teamWallet;
  // Ecosystem - 25M
  address public _ecosystemWallet;
  // Advisors - 20M
  address public _reservesWallet;
  // DEX - 2M
  address public _dexWallet;
  // Liquidity incentives - 7M
  address public _liqWallet;

  // Amount of tokens per buyer in private sale - 25M
  mapping(address => uint256) public _buyerTokens;

  // Amount of tokens assigned to buyers
  uint256 public _totalBuyerTokens;

  // Amount of tokens a wallet has withdrawn already, per type
  mapping(string => mapping(address => uint256)) public _walletTokensWithdrawn;


  //
  // ******************* SETUP *******************
  //

  constructor (string memory name, string memory symbol) public ERC20(name, symbol) {

    // Set owner wallet
    _ownerWallet = _msgSender();

    // Mint 100M tokens for contract
    _mint(address(this), 100000000000000000000000000);
  }

  //
  // ******************* WALLETS SETUP *******************
  //

  // Owner can update owner
  function updateOwner(address owner) public {
    require(_msgSender() == _ownerWallet, "Only owner can update wallets");

    _ownerWallet = owner; 
  }

  // Update wallets
  function updateWallets(address publicSale, address team, address ecosystem, address reserves, address dex, address liq) public {
    require(_msgSender() == _ownerWallet, "Only owner can update wallets");

    _publicSaleWallet = publicSale; 
    _teamWallet = team;
    _ecosystemWallet = ecosystem;
    _reservesWallet = reserves;
    _dexWallet = dex;
    _liqWallet = liq;
  }

  // Update buyer tokens
  function setBuyerTokens(address buyer, uint256 tokenAmount) public {
    require(_msgSender() == _ownerWallet, "Only owner can set buyer tokens");

    // Update total
    _totalBuyerTokens -= _buyerTokens[buyer];
    _totalBuyerTokens += tokenAmount;

    // Check if enough tokens left, can max assign 25M
    require(_totalBuyerTokens <= 25000000000000000000000000, "Max amount reached");

    // Update map
    _buyerTokens[buyer] = tokenAmount;
  }

  //
  // ******************* OWNER *******************
  //

  function publicSaleWithdraw(uint256 tokenAmount) public {
    require(_msgSender() == _publicSaleWallet, "Unauthorized public sale wallet");

    uint256 hasWithdrawn = _walletTokensWithdrawn["publicsale"][_msgSender()];

    // Total = 1M instant
    uint256 canWithdraw = 1000000000000000000000000 - hasWithdrawn;

    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["publicsale"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);    
  }

  function teamWithdraw(uint256 tokenAmount) public {
    require(_msgSender() == _teamWallet, "Unauthorized team wallet");

    // Cliff = 6 months = 262800 minutes
    // Vesting = 18 months 788401 minutes
    // Total = 20M
    uint256 canWithdraw = walletCanWithdraw(_msgSender(), "team", 0, 262800, 788401, 20000000000000000000000000);
    
    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["team"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);  
  }

  function ecosystemWithdraw(uint256 tokenAmount) public {
    require(_msgSender() == _ecosystemWallet, "Unauthorized ecosystem wallet");

    // Cliff = 3 months = 131400 minutes
    // Vesting = 24 months = 1051202 minutes
    // Total = 25M
    uint256 canWithdraw = walletCanWithdraw(_msgSender(), "ecosystem", 0, 131400, 1051202, 25000000000000000000000000);
    
    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["ecosystem"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);  
  }

  function reservesWithdraw(uint256 tokenAmount) public {
    require(_msgSender() == _reservesWallet, "Unauthorized reserves wallet");

    // Cliff = 6 months = 262800 minutes
    // Vesting = 24 months = 1051202 minutes
    // Total = 20M
    uint256 canWithdraw = walletCanWithdraw(_msgSender(), "reserve", 0, 262800, 1051202, 20000000000000000000000000);
    
    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["reserve"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);  
  }

  function dexWithdraw(uint256 tokenAmount) public {
    require(_msgSender() == _dexWallet, "Unauthorized dex wallet");

    uint256 hasWithdrawn = _walletTokensWithdrawn["dex"][_msgSender()];

    // Total = 2M instant
    uint256 canWithdraw = 2000000000000000000000000 - hasWithdrawn;

    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["dex"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);    
  }

  function liqWithdraw(uint256 tokenAmount) public {
    require(_msgSender() == _liqWallet, "Unauthorized liquidity incentives wallet");

    // Cliff = 0
    // Vesting = 6 months = 262800 minutes
    // Total = 7M
    uint256 canWithdraw = walletCanWithdraw(_msgSender(), "liq", 0, 0, 262800, 7000000000000000000000000);
    
    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["liq"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);  
  }


  function buyerWithdraw(uint256 tokenAmount) public {
    
    // TGE: 10%
    // Cliff = 2 months = 87600 minutes
    // Vesting = 6 months = 262800 minutes
    uint256 canWithdraw = walletCanWithdraw(_msgSender(), "privatesale", 10, 87600, 262800, _buyerTokens[_msgSender()]);
    
    require(tokenAmount <= canWithdraw, "Withdraw amount too high");

    _walletTokensWithdrawn["privatesale"][_msgSender()] += tokenAmount;

    _transfer(address(this), _msgSender(), tokenAmount);    
  }

  //
  // ******************* UNLOCK CALCULATION *******************
  //

  function walletCanWithdraw(address wallet, string memory walletType, uint256 initialPercentage, uint256 cliffMinutes, uint256 vestingMinutes, uint256 totalTokens) public view returns(uint256) {
    
    uint256 minutesDiff = (block.timestamp - _deployTime).div(60);

    // Tokens already withdrawn
    uint256 withdrawnTokens = _walletTokensWithdrawn[walletType][wallet];

    // Initial tokens
    uint256 initialTokens = 0;
    if (initialPercentage != 0) {
      initialTokens = totalTokens.mul(initialPercentage).div(100);
    }

    // Cliff not ended
    if (minutesDiff < uint256(cliffMinutes)) {
      return initialTokens - withdrawnTokens;
    }

    // Tokens per minute over vesting period
    uint256 buyerTokensPerMinute = totalTokens.sub(initialTokens).div(vestingMinutes); 

    // Advanced minutes minus cliff
    uint256 unlockedMinutes = minutesDiff - uint256(cliffMinutes); 

    // Unlocked minutes * tokens per minutes + initial tokens
    uint256 unlockedTokens = unlockedMinutes.mul(buyerTokensPerMinute).add(initialTokens); 
    
    // No extra tokens unlocked
    if (unlockedTokens <= withdrawnTokens) {
      return 0;
    }

    // Check if buyer reached max
    if (unlockedTokens > totalTokens) {
      return totalTokens - withdrawnTokens;
    }

    // Result
    return unlockedTokens - withdrawnTokens;
  }

}
