pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IBGOFStakingOld.sol";

interface IBGOFStaking {
  function bfgtStake(address user, uint256 _amount, uint256 _packageId) external;
}

contract FarmBFGTV3 is ReentrancyGuard, Ownable {
  string public name = "Farm BFGT V3";

  uint256 profileId;
  uint256 packageId = 4;
  uint256 public totalStaking = 0;
  uint256 public totalClaimedStaking = 0;
  uint256 public totalProfit = 0;
  uint256 public totalClaimedProfit = 0;
  address public accountReward;
  address public accountStake;
  address public bgofStaking;
  IERC20 public stakeToken;
  IERC20 public rewardToken;

  // @important mainnet
  uint256 public PERIOD = 30 days;
  uint256 public rateReward = 100;

  bool public paused = false;

  bool public isRestake = false;

  mapping(uint256 => uint256[]) public lockups;

  IBGOFStakingOld.UserInfo[] public userInfo;

  mapping(uint256 => IBGOFStakingOld.Package) public packages;

  event Deposit(address by, uint256 amount);
  event ClaimProfit(address by, uint256 amount);
  event ClaimStaking(address by, uint256 amount);

  constructor() {
    // @important mainnet
    stakeToken = IERC20(0x382978cB7c29CaCde95dbBCe97C291156217A058);
    rewardToken = IERC20(0x5f949De3131f00B296Fc4c99058D40960B90FAbC);
    // @important mainnet
    accountReward = 0xE3D9E6c5D5a70Fd96DF18362b5bC80BEe98Bc7e4;
    accountStake = 0xE3D9E6c5D5a70Fd96DF18362b5bC80BEe98Bc7e4;

    totalClaimedProfit = 1716376767674965277777700;
    totalProfit = 5939306190000000000000000;
    totalStaking = 13367895000000000000000000;
    totalClaimedStaking = 0;
    packages[1] = IBGOFStakingOld.Package(12, 6, true);
    lockups[1] = [5, 10, 25, 40, 65, 100];
    packages[2] = IBGOFStakingOld.Package(27, 9, true);
    lockups[2] = [20, 50, 100];
    packages[3] = IBGOFStakingOld.Package(48, 12, true);
    lockups[2] = [100];
  }

  function migrate(IBGOFStakingOld.UserInfo[] memory _data) public onlyOwner {
    require(profileId == _data[0].id, "Not migrating");
    for (uint i = 0; i < _data.length; i++) {
      userInfo.push(_data[i]);
    }

    profileId += _data.length;
  }

  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  modifier whenPaused() {
    require(paused);
    _;
  }

  function pause() public onlyOwner {
    paused = true;
  }

  function setPeriod(uint256 _period) public onlyOwner {
    PERIOD = _period;
  }

  function setReskate(bool _isRestake) public onlyOwner {
    isRestake = _isRestake;
  }

  function unpause() public onlyOwner {
    paused = false;
  }

  function addPackage(
    uint256 _totalPercentProfit,
    uint256 _vestingTime,
    uint256[] memory _lockups
  ) public onlyOwner {
    require(_totalPercentProfit > 0, "Profit can not be 0");
    require(_vestingTime > 0, "Vesting time can not be 0");
    packages[packageId] = IBGOFStakingOld.Package(_totalPercentProfit, _vestingTime, true);
    lockups[packageId] = _lockups;
    packageId++;
  }

  function setPackage(uint256 _packageId, bool _isActive) public onlyOwner {
    require(packages[_packageId].totalPercentProfit > 0, "Invalid package id");
    packages[_packageId].isActive = _isActive;
  }

  function setStakeToken(IERC20 _stakeToken) public onlyOwner {
    stakeToken = _stakeToken;
  }

  function setRewardToken(IERC20 _rewardToken) public onlyOwner {
    rewardToken = _rewardToken;
  }

  function setRateReward(uint256 _rate) public onlyOwner {
    require(_rate > 0, "Reward can not be 0");
    rateReward = _rate;
  }

  function getLockups(uint256 _packageId) public view returns (uint256[] memory) {
    return lockups[_packageId];
  }

  function getProfilesByAddress(
    address user
  ) public view returns (IBGOFStakingOld.UserInfo[] memory) {
    uint256 total = 0;
    for (uint256 i = 0; i < userInfo.length; i++) {
      if (userInfo[i].user == user) {
        total++;
      }
    }

    require(total > 0, "Invalid profile address");

    IBGOFStakingOld.UserInfo[] memory profiles = new IBGOFStakingOld.UserInfo[](total);
    uint256 j;

    for (uint256 i = 0; i < userInfo.length; i++) {
      if (userInfo[i].user == user) {
        profiles[j] = userInfo[i]; // step 3 - fill the array
        j++;
      }
    }

    return profiles;
  }

  function getProfilesLength() public view returns (uint256) {
    return userInfo.length;
  }

  function stake(uint256 _amount, uint256 _packageId) public payable {
    require(_amount > 0, "Amount cannot be 0");
    require(packages[_packageId].totalPercentProfit > 0, "Invalid package id");
    require(packages[_packageId].isActive == true, "This package is not available");

    stakeToken.transferFrom(msg.sender, accountStake, _amount);

    _stake(msg.sender, _amount, _packageId);
  }

  function _stake(address user, uint256 _amount, uint256 _packageId) internal {
    uint256 profit = (_amount * packages[_packageId].totalPercentProfit) / 100;

    IBGOFStakingOld.UserInfo memory profile;
    profile.id = profileId;
    profile.packageId = _packageId;
    profile.user = user;
    profile.amount = _amount;
    profile.profitClaimed = 0;
    profile.stakeClaimed = 0;
    profile.vestingStart = block.timestamp;
    profile.vestingEnd = block.timestamp + packages[_packageId].vestingTime * PERIOD;
    profile.refunded = false;
    profile.totalProfit = profit;
    userInfo.push(profile);

    profileId++;

    totalStaking += _amount;

    totalProfit += profit;

    emit Deposit(user, _amount);
  }

  function getCurrentProfit(uint256 _profileId) public view returns (uint256) {
    require(userInfo[_profileId].packageId != 0, "Invalid profile");

    IBGOFStakingOld.UserInfo memory info = userInfo[_profileId];

    if (block.timestamp > info.vestingEnd) {
      return info.totalProfit;
    }

    uint256 profit = ((block.timestamp - info.vestingStart) * info.totalProfit) /
      (info.vestingEnd - info.vestingStart);
    return profit;
  }

  function claimProfit(uint256 _profileId) public nonReentrant whenNotPaused {
    require(userInfo[_profileId].user == msg.sender, "You are not onwer");
    IBGOFStakingOld.UserInfo storage info = userInfo[_profileId];

    uint256 profit = getCurrentProfit(_profileId);
    uint256 remainProfit = profit - info.profitClaimed;

    require(remainProfit > 0, "No profit");

    uint256 netReward = (remainProfit * rateReward) / 100;

    if (isRestake) {
      IBGOFStaking(bgofStaking).bfgtStake(msg.sender, netReward, 3);
    } else {
      rewardToken.transferFrom(accountReward, msg.sender, netReward);
    }
    info.profitClaimed += remainProfit;

    // Update total profit claimed
    totalClaimedProfit += profit;

    emit ClaimProfit(msg.sender, remainProfit);
  }

  function getCurrentStakeUnlock(uint256 _profileId) public view returns (uint256) {
    require(userInfo[_profileId].packageId != 0, "Invalid profile");

    IBGOFStakingOld.UserInfo memory info = userInfo[_profileId];

    uint256[] memory pkgLockups = getLockups(info.packageId);

    if (block.timestamp < info.vestingEnd) {
      return 0;
    }

    // Not lockup, can withdraw 100% after vesting time
    if (pkgLockups.length == 1 && pkgLockups[0] == 100) {
      return info.amount;
    }

    uint256 length = pkgLockups.length;

    for (uint256 i = length - 1; i >= 0; i--) {
      uint256 limitWithdrawTime = info.vestingEnd + (i + 1) * PERIOD;
      if (block.timestamp > limitWithdrawTime) {
        return (pkgLockups[i] * info.amount) / 100;
      }
    }

    return 0;
  }

  function claimStaking(uint256 _profileId) public nonReentrant whenNotPaused {
    require(userInfo[_profileId].user == msg.sender, "You are not onwer");
    require(userInfo[_profileId].vestingEnd < block.timestamp, "Can not claim before vesting end");

    IBGOFStakingOld.UserInfo storage info = userInfo[_profileId];
    uint256 amountUnlock = getCurrentStakeUnlock(_profileId);

    uint256 remainAmount = amountUnlock - info.stakeClaimed;

    require(remainAmount > 0, "No staking");

    stakeToken.transferFrom(accountStake, msg.sender, remainAmount);
    info.stakeClaimed += remainAmount;

    // Update total staking
    totalClaimedStaking += remainAmount;

    emit ClaimStaking(msg.sender, remainAmount);
  }

  function withdraw(uint256 _amount) public onlyOwner {
    stakeToken.transfer(msg.sender, _amount);
  }
}
