import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { BGFTStakingMigrate, BGOFStaking, BGOFStakingMigrate, MockERC20 } from "../typechain"

async function approve() {
  const bgofStaking: BGOFStakingMigrate = await ethers.getContract("BGOFStakingMigrate")
  const bgftStaking: BGFTStakingMigrate = await ethers.getContract("BGFTStakingMigrate")

  const bgof: MockERC20 = await ethers.getContractAt(
    "MockERC20",
    "0xBf43a22b8F23dd8fc09a70f194f11F51fA906061"
  )

  const bankWallet: Signer = new ethers.Wallet(
    "0x95ca1f4a1e4bd210b81be13d18d8ac9a09dc56b52ddee63e002103e5a771f33b",
    bgof.provider
  )

  const _bgof = await bgof.connect(bankWallet)

  await _bgof.approve(
    bgofStaking.address,
    ethers.utils.parseEther("2000000")
  )

  await _bgof.approve(
    bgftStaking.address,
    ethers.utils.parseEther("2000000")
  )
}

approve()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
