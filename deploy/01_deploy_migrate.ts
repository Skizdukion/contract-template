import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains } from "../helper-hardhat-config"
import { verify } from "../helper-functions"
import { FarmBGOFV2, BGOFStaking, FarmBFGTV2, MockERC20 } from "../typechain"
import { Signer } from "ethers"

const deployFunction: DeployFunction = async () => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy("FarmBFGTV2", {
    contract: "FarmBFGTV2",
    from: deployer,
    log: true,
    args: [],
  })

  await deploy("FarmBGOFV2", {
    contract: "FarmBGOFV2",
    from: deployer,
    log: true,
    args: [],
  })

  // const bgofMigrate: FarmBGOFV2 = await ethers.getContract("FarmBGOFV2")
  // await bgofMigrate.initialize("0x400555C50ea6dB26b2BC18F96A1D2aEfeA8fb21D")

  // const bfgtMigrate: FarmBFGTV2 = await ethers.getContract("FarmBFGTV2")
  // await bfgtMigrate.initialize("0xB796ff98f3AF1C4c5D4BBd82338427adC16a7014", bgofMigrate.address)

  // await bgofMigrate.setBFGT(bfgtMigrate.address, { gasLimit: 200000 })

  // if (!developmentChains.includes(network.name) && process.env.BSCSCAN_API_KEY) {
  //   await verify(bgofMigrate.address, [])
  //   await verify(bfgtMigrate.address, [])
  // }

  // const bgof: MockERC20 = await ethers.getContractAt(
  //   "MockERC20",
  //   "0xBf43a22b8F23dd8fc09a70f194f11F51fA906061"
  // )

  // const bankWallet: Signer = new ethers.Wallet(
  //   "0x95ca1f4a1e4bd210b81be13d18d8ac9a09dc56b52ddee63e002103e5a771f33b",
  //   bgof.provider
  // )

  // const _bgof = await bgof.connect(bankWallet)

  // await _bgof.approve(bgofMigrate.address, ethers.utils.parseEther("2000000"))

  // await _bgof.approve(bfgtMigrate.address, ethers.utils.parseEther("2000000"))
}

export default deployFunction
deployFunction.tags = [`all`, `testnet`]
