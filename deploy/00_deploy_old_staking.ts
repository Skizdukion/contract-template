import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { developmentChains } from "../helper-hardhat-config"
import { verify } from "../helper-functions"
import { BGOFStaking, MockERC20 } from "../typechain"

const deployFunction: DeployFunction = async () => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  if (developmentChains.includes(network.name)) {
    await deploy("BUSD", {
      contract: "MockERC20",
      from: deployer,
      log: true,
      args: ["BUSD", "BUSD", ethers.utils.parseEther("100000000000000000")],
    })

    await deploy("USDT", {
      contract: "MockERC20",
      from: deployer,
      log: true,
      args: ["BUSD", "BUSD", ethers.utils.parseEther("100000000000000000")],
    })

    await deploy("WETH", {
      contract: "WETH9",
      from: deployer,
      log: true,
      args: [],
    })
  }

  await deploy("BGOFStaking", {
    contract: "BGOFStaking",
    from: deployer,
    log: true,
    args: [],
  })

  const bgof: BGOFStaking = await ethers.getContract("BGOFStaking")

  const busd: MockERC20 = await ethers.getContract("BUSD")

  const usdt: MockERC20 = await ethers.getContract("USDT")

  const signers: SignerWithAddress[] = await ethers.getSigners()

  await bgof.initialize(busd.address, usdt.address, deployer, deployer)

  for (let index = 0; index < signers.length; index++) {
    const element = signers[index]
    await busd.transfer(element.address, ethers.utils.parseEther("20000000"))
    const _busd = await busd.connect(element)
    await _busd.approve(bgof.address, ethers.utils.parseEther("20000000"))
  }

  for (let index = 0; index < 87; index++) {
    const _bgof = await bgof.connect(signers[getRndInteger(0, signers.length - 1)])
    await _bgof.stake(getRndInteger(1000, 1000000000000), getRndInteger(1, 3))
  }
}

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default deployFunction
deployFunction.tags = [`all`]
