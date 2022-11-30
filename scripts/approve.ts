import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { BigNumber, Signer } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { FarmBFGTV2, BGOFStaking, FarmBGOFV2, MockERC20 } from "../typechain"

async function approve() {
  const bgofStaking: FarmBGOFV2 = await ethers.getContract("FarmBGOFV2")
  const bfgtStaking: FarmBFGTV2 = await ethers.getContract("FarmBFGTV2")

  const bgof: MockERC20 = await ethers.getContractAt(
    "MockERC20",
    "0xBf43a22b8F23dd8fc09a70f194f11F51fA906061"
  )

  const bfgt: MockERC20 = await ethers.getContractAt(
    "MockERC20",
    "0x6999171fE1e531B89b0A4ef6d10158e8B4384d3C"
  )

  const bankWallet: Signer = new ethers.Wallet(
    "0x95ca1f4a1e4bd210b81be13d18d8ac9a09dc56b52ddee63e002103e5a771f33b",
    bgof.provider
  )

  const _bgof = await bgof.connect(bankWallet)
  const _bfgt = await bfgt.connect(bankWallet)

  await _bgof.approve(
    bgofStaking.address,
    ethers.utils.parseEther("20000000000000000")
  )

  await _bgof.approve(
    bfgtStaking.address,
    ethers.utils.parseEther("20000000000000000")
  )

  await _bfgt.approve(
    bgofStaking.address,
    ethers.utils.parseEther("20000000000000000")
  )

  await _bfgt.approve(
    bfgtStaking.address,
    ethers.utils.parseEther("20000000000000000")
  )
}

approve()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
