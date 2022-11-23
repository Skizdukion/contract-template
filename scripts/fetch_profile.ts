import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { BGOFStaking } from "../typechain"

async function nft_total_supply_uri() {
  const bgof: BGOFStaking = await ethers.getContractAt(
    "BGOFStaking",
    "0x4F4f50b72D25E7458343311625B0419570eC7899"
  )
  const bgft: BGOFStaking = await ethers.getContractAt(
    "BGOFStaking",
    "0x67D26ec6bBa3B74D2F6EfbFFB09629684E81Ee37"
  )

  const bgofProfile = await bgof.getProfilesLength()

  console.log("BGOF DATA")

  for (let index = 0; index < bgofProfile.toNumber(); index++) {
    const data = await bgof.userInfo(index)
    console.log(index)
    if (data.user == "0xB814C333FE721BA53828eCb70771bFb797cEA289") {
      console.log(data)
    }
  }

  console.log("BGFT DATA")

  const bgftProfile = await bgft.getProfilesLength()

  for (let index = 0; index < bgftProfile.toNumber(); index++) {
    const data = await bgft.userInfo(index)
    console.log(index)
    if (data.user == "0xB814C333FE721BA53828eCb70771bFb797cEA289") {
      console.log(data)
    }
  }

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
