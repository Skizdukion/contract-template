import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FarmBFGTV2, BGOFStaking, FarmBGOFV2, MockERC20 } from "../typechain"

async function approve() {
  const bgof: FarmBGOFV2 = await ethers.getContract("FarmBGOFV2")
  const bgft: FarmBFGTV2 = await ethers.getContract("FarmBFGTV2")

  await bgft.setReskate(false)
  await bgof.setReskate(false)
}

approve()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
