pragma solidity >=0.8.1;

interface IBGOFStakingOld {
  struct UserInfo {
    uint256 id;
    address user;
    uint256 amount; // How many tokens the user has provided.
    uint256 profitClaimed; // default false
    uint256 stakeClaimed; // default false
    uint256 vestingStart;
    uint256 vestingEnd;
    uint256 totalProfit;
    uint256 packageId;
    bool refunded;
  }

  struct Package {
    uint256 totalPercentProfit; // 5 = 5%
    uint256 vestingTime; // 1 = 1 month
    bool isActive;
  }

  function totalStaking() external view returns (uint256);

  function totalProfit() external view returns (uint256);

  function totalClaimedStaking() external view returns (uint256);

  function totalClaimedProfit() external view returns (uint256);

  function stakeToken() external view returns (address);

  function rewardToken() external view returns (address);

  function rateReward() external view returns (uint256);

  function accountStake() external view returns (address);

  function accountReward() external view returns (address);

  function packages(uint256 index) external view returns (Package memory);

  function getLockups(uint256 index) external view returns (uint256[] memory);

  function getProfilesLength() external view returns (uint256);

  function userInfo(uint256 input) external view returns (UserInfo memory);
}
