import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { BGFTStakingMigrate, BGOFStaking, BGOFStakingMigrate, MockERC20 } from "../typechain"

async function approve() {
  const bgof: BGOFStakingMigrate = await ethers.getContract("BGOFStakingMigrate")
  const bgft: BGFTStakingMigrate = await ethers.getContract("BGFTStakingMigrate")

  await bgft.setReskate(true)
  await bgof.setReskate(false)
}

approve()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
