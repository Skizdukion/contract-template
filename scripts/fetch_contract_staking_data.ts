import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FarmBFGTV2, BGOFStaking, FarmBGOFV2 } from "../typechain"

async function nft_total_supply_uri() {
  const bgof: FarmBGOFV2 = await ethers.getContractAt(
    "FarmBGOFV2",
    "0x851356ae760d987E095750cCeb3bC6014560891C"
  )
  // const bgof: FarmBGOFV2 = await ethers.getContractAt(
  //   "FarmBGOFV2",
  //   "0x0eF029F0428b8d6A539b5b84C4d746d0809da0AD"
  // )

  const bgofProfile = await bgof.getProfilesLength()

  console.log("BGOF DATA --------------------")

  console.log("Stake token " + (await bgof.stakeToken()))
  console.log("Reward token " + (await bgof.rewardToken()))

  console.log("packages[1] " + (await bgof.packages(1)))
  console.log("lockups[1] " + (await bgof.getLockups(1)))

  console.log("packages[2] " + (await bgof.packages(2)))
  console.log("lockups[2] " + (await bgof.getLockups(2)))

  console.log("packages[3] " + (await bgof.packages(3)))
  console.log("lockups[3] " + (await bgof.getLockups(3)))

  console.log("stakeToken " + (await bgof.packages(3)))
  console.log("rewardToken " + (await bgof.getLockups(3)))

  console.log("profileLength " + (await bgof.getProfilesLength()))

  console.log("totalClaimedProfit " + (await bgof.totalClaimedProfit()))

  console.log("totalProfit " + (await bgof.totalProfit()))

  console.log("totalStaking " + (await bgof.totalStaking()))

  console.log("totalClaimedStaking " + (await bgof.totalClaimedStaking()))

  for (let index = 0; index < bgofProfile.toNumber(); index++) {
    const data = await bgof.userInfo(index)

    // id: BigNumber;
    //   user: string;
    //   amount: BigNumber;
    //   profitClaimed: BigNumber;
    //   stakeClaimed: BigNumber;
    //   vestingStart: BigNumber;
    //   vestingEnd: BigNumber;
    //   totalProfit: BigNumber;
    //   packageId: BigNumber;
    //   refunded: boolean;
    console.log(
      "{" +
        "id: " +
        data.id +
        "," +
        "user: '" +
        data.user +
        "'," +
        "amount: '" +
        data.amount +
        "'," +
        "profitClaimed: '" +
        data.profitClaimed +
        "'," +
        "stakeClaimed: '" +
        data.stakeClaimed +
        "'," +
        "vestingStart: '" +
        data.vestingStart +
        "'," +
        "vestingEnd: '" +
        data.vestingEnd +
        "'," +
        "totalProfit: '" +
        data.totalProfit +
        "'," +
        "packageId: '" +
        data.packageId +
        "'," +
        "refunded: " +
        data.refunded +
        "},"
    )
  }
}

nft_total_supply_uri()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
