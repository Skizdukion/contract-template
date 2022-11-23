import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains } from "../helper-hardhat-config"
import { verify } from "../helper-functions"
import { BGFTStakingMigrate, BGOFStaking, BGOFStakingMigrate } from "../typechain"

const deployFunction: DeployFunction = async () => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy("BGOFStakingMigrate", {
    contract: "BGOFStakingMigrate",
    from: deployer,
    log: true,
    args: [],
  })

  await deploy("BGFTStakingMigrate", {
    contract: "BGFTStakingMigrate",
    from: deployer,
    log: true,
    args: [],
  })

  const bgofMigrate: BGOFStakingMigrate = await ethers.getContract("BGOFStakingMigrate")
  // await bgofMigrate.initialize("0x400555C50ea6dB26b2BC18F96A1D2aEfeA8fb21D")

  const bgftMigrate: BGFTStakingMigrate = await ethers.getContract("BGFTStakingMigrate")
  // await bgftMigrate.initialize("0xB796ff98f3AF1C4c5D4BBd82338427adC16a7014", bgofMigrate.address)

  // await bgofMigrate.setBGFT(bgftMigrate.address)

  if (!developmentChains.includes(network.name) && process.env.BSCSCAN_API_KEY) {
    await verify(bgofMigrate.address, [])
    await verify(bgftMigrate.address, [])
  }
}

export default deployFunction
deployFunction.tags = [`all`, `testnet`]
