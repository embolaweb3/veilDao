import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { saveDeployment } from './utils'

task('deploy-ghostgov', 'Deploy GhostGov FHE governance contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    const { ethers, network } = hre

    console.log(`\n👻 Deploying GhostGov to ${network.name}...`)

    const [deployer] = await ethers.getSigners()
    console.log(`   Deployer: ${deployer.address}`)
    console.log(`   Balance:  ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`)

    const GhostGov = await ethers.getContractFactory('GhostGov')
    const ghostgov = await GhostGov.deploy()
    await ghostgov.waitForDeployment()

    const address = await ghostgov.getAddress()
    console.log(`   GhostGov deployed: ${address}`)

    saveDeployment(network.name, 'GhostGov', address)
    console.log(`   Deployment saved ✓`)
    console.log(`\n   Update frontend/lib/contracts.ts → CONTRACT_ADDRESSES[chainId] = "${address}"\n`)

    return address
  }
)
