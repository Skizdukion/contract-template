import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { BGFTStakingMigrate, BGOFStaking, BGOFStakingMigrate, MockERC20 } from "../typechain"

async function approve() {
  const bgof: BGOFStakingMigrate = await ethers.getContract("BGOFStakingMigrate")
  const bgft: BGFTStakingMigrate = await ethers.getContract("BGFTStakingMigrate")

  await bgft.sync("0xB796ff98f3AF1C4c5D4BBd82338427adC16a7014")
  await bgof.sync("0x400555C50ea6dB26b2BC18F96A1D2aEfeA8fb21D")
}

approve()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
