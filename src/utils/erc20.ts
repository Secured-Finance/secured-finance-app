import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../services/sdk/lib/abi/ERC20.json'

export const getContract = (provider: provider, address: string) => {
	const web3 = new Web3(provider)
	const contract = new web3.eth.Contract(
		(ERC20ABI.abi as unknown) as AbiItem,
		address,
	)
	return contract
}

export const getAllowance = async (tokenContract: Contract, moneyMarketContract: Contract, account: string): Promise<string> => {
	try {
		const allowance: string = await tokenContract.methods
		.allowance(account, moneyMarketContract.options.address)
		.call()
		return allowance
	} catch (e) {
		return '0'
	}
}

export const getBalance = async (provider: provider, tokenAddress: string, account: string): Promise<string> => {
	const tokenContract = getContract(provider, tokenAddress)
	try {
		const balance: string = await tokenContract.methods.balanceOf(account).call()
		return balance
	} catch (e) {
		return '0'
	}
}
