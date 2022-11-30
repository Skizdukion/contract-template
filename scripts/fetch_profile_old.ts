import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FarmBFGTV2, BGOFStaking, FarmBGOFV2 } from "../typechain"

async function nft_total_supply_uri() {
  const bgof: FarmBGOFV2 = await ethers.getContractAt(
    "FarmBGOFV2",
    "0xA64F1a44ea659F6d0aDD6d3Db387bA6D58bb262d"
  )
  // const bfgt: FarmBFGTV2 = await ethers.getContractAt("FarmBFGTV2", "0xB796ff98f3AF1C4c5D4BBd82338427adC16a7014")

  const bgofProfile = await bgof.getProfilesLength()

  console.log("BGOF DATA --------------------")

  console.log(bgof.address)
  console.log(await bgof.stakeToken())
  console.log(await bgof.rewardToken())

  for (let index = 0; index < bgofProfile.toNumber(); index++) {
    const data = await bgof.userInfo(index)
    const profit = await bgof.getCurrentProfit(index)
    const stakeUnlock = await bgof.getCurrentStakeUnlock(index)

    console.log(index)
    console.log("data profile: " + data)
    console.log("profit: " + profit)
    console.log("stake unlock: " + stakeUnlock)
  }

  // console.log("BFGT DATA --------------------")

  // const bfgtProfile = await bfgt.getProfilesLength()

  // console.log(bfgt.address)
  // console.log(await bfgt.stakeToken())
  // console.log(await bfgt.rewardToken())

  // for (let index = 0; index < bfgtProfile.toNumber(); index++) {
  //   const data = await bfgt.userInfo(index)
  //   const profit = await bfgt.getCurrentProfit(index)
  //   const stakeUnlock = await bfgt.getCurrentStakeUnlock(index)

  //   console.log(index)
  //   console.log("data profile: " + data)
  //   console.log("profit: " + profit)
  //   console.log("stake unlock: " + stakeUnlock)
  // }
}

nft_total_supply_uri()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
