import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { saveDeployment } from './utils'

task('deploy-all', 'Deploy GhostGov + GhostAnalytics + GhostTreasury and wire them up')
  .addOptionalParam('quorum', 'Minimum votes for quorum (0 = disabled)', '0')
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const { ethers, network } = hre

    console.log(`\n👻 Deploying GhostGov system to ${network.name}...`)
    const [deployer] = await ethers.getSigners()
    console.log(`   Deployer: ${deployer.address}`)
    console.log(`   Balance:  ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`)

    //  GhostGov 
    console.log(`\n1/3  Deploying GhostGov...`)
    const GhostGov = await ethers.getContractFactory('GhostGov')
    const ghostgov = await GhostGov.deploy()
    await ghostgov.waitForDeployment()
    const govAddr = await ghostgov.getAddress()
    console.log(`     GhostGov:       ${govAddr}`)

    // GhostTreasury 
    console.log(`2/3  Deploying GhostTreasury...`)
    const GhostTreasury = await ethers.getContractFactory('GhostTreasury')
    const treasury = await GhostTreasury.deploy(govAddr)
    await treasury.waitForDeployment()
    const treasuryAddr = await treasury.getAddress()
    console.log(`     GhostTreasury:  ${treasuryAddr}`)

    // GhostAnalytics 
    console.log(`3/3  Deploying GhostAnalytics...`)
    const quorum = parseInt(args.quorum)
    const GhostAnalytics = await ethers.getContractFactory('GhostAnalytics')
    const analytics = await GhostAnalytics.deploy(govAddr, quorum)
    await analytics.waitForDeployment()
    const analyticsAddr = await analytics.getAddress()
    console.log(`     GhostAnalytics: ${analyticsAddr}`)

    // Wire up 
    console.log(`\nWiring contracts...`)
    await (await ghostgov.setAnalyticsEngine(analyticsAddr)).wait()
    console.log(`     GhostGov.analyticsEngine = GhostAnalytics ✓`)
    await (await ghostgov.setTreasury(treasuryAddr)).wait()
    console.log(`     GhostGov.treasury = GhostTreasury ✓`)

    //  Save + print
    saveDeployment(network.name, 'GhostGov',       govAddr)
    saveDeployment(network.name, 'GhostAnalytics', analyticsAddr)
    saveDeployment(network.name, 'GhostTreasury',  treasuryAddr)

    console.log(`\n✅ Deployment complete. Update frontend/lib/contracts.ts:`)
    console.log(`   CONTRACT_ADDRESSES[chainId]  = "${govAddr}"`)
    console.log(`   ANALYTICS_ADDRESSES[chainId] = "${analyticsAddr}"`)
    console.log(`   TREASURY_ADDRESSES[chainId]  = "${treasuryAddr}"\n`)
  })
