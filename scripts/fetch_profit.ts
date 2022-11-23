import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { BGOFStaking } from "../typechain"

async function nft_total_supply_uri() {
  const oldBgof: BGOFStaking = await ethers.getContractAt(
    "BGOFStaking",
    "0xB796ff98f3AF1C4c5D4BBd82338427adC16a7014"
  )
  const newBgof: BGOFStaking = await ethers.getContractAt(
    "BGOFStaking",
    "0x3444bA169Bd2bA3E11c9B929b15DE2b4bB36c12B"
  )

  const profileOldLength = await oldBgof.getProfilesLength()
  const profileNewLength = await newBgof.getProfilesLength()

  console.log(profileOldLength)

  console.log("EQUAL: " + (profileOldLength.toString() == profileNewLength.toString()))

  // 100000000

  const profilesOld = await oldBgof.getProfilesByAddress(
    "0xB814C333FE721BA53828eCb70771bFb797cEA289"
  )

  const profilesNew = await newBgof.getProfilesByAddress(
    "0xB814C333FE721BA53828eCb70771bFb797cEA289"
  )

  console.log(profilesOld)

  console.log("EQUAL: " + (profilesOld.toString() == profilesNew.toString()))

  //   for (let index = 0; index < 63; index++) {
  //     const _data1 = await oldBgof.getCurrentProfit(index)
  //     const _data2 = await newBgof.getCurrentProfit(index)

  //     console.log("---------------------------------")

  //     console.log("old data " + _data1)
  //     console.log("new data " + _data2)
  //   }

  //   for (let index = 0; index < 63; index++) {
  //     const _data1 = await oldBgof.userInfo(index)
  //     const _data2 = await newBgof.userInfo(index)

  //     console.log("---------------------------------")

  //     // assert.equal(_data1.toString(), _data2.toString())
  //     console.log("USER " + _data1.user)
  //     console.log("EQUAL: " + (_data1.toString() == _data2.toString()))
  //   }

  //   for (let index = 0; index < 64; index++) {
  //     const _data1 = await oldBgof.getCurrentStakeUnlock(index)
  //     const _data2 = await newBgof.getCurrentStakeUnlock(index)

  //     console.log("---------------------------------")

  //     console.log(index)
  //     console.log("EQUAL: " + (_data1.toString() == _data2.toString()))
  //   }
}

nft_total_supply_uri()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
