import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { saveDeployment } from './utils'

// Task to deploy the VeilDAO contract
task('deploy-veil-dao', 'Deploy the VeilDAO contract to the selected network').setAction(async (_, hre: HardhatRuntimeEnvironment) => {
	const { ethers, network } = hre

	console.log(`Deploying VeilDAO to ${network.name}...`)

	// Get the deployer account
	const [deployer] = await ethers.getSigners()
	console.log(`Deploying with account: ${deployer.address}`)

	// Deploy the contract
	const VeilDAO = await ethers.getContractFactory('VeilDAO')
	const veilDao = await VeilDAO.deploy()
	await veilDao.waitForDeployment()

	const veilDaoAddress = await veilDao.getAddress()
	console.log(`VeilDAO deployed to: ${veilDaoAddress}`)

	// Save the deployment
	saveDeployment(network.name, 'VeilDAO', veilDaoAddress)

	return veilDaoAddress
})