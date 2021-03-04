import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

// Contract addresses
export const getMoneyMarketAddress = (securedFinance) => {
	return securedFinance && securedFinance.moneyMarket
}
export const getLoanAddress = (securedFinance) => {
  	return securedFinance && securedFinance.loan
}
export const getFxMarketAddress = (securedFinance) => {
  	return securedFinance && securedFinance.fxMarket
}
export const getCollateralAddress = (securedFinance) => {
	return securedFinance && securedFinance.collateral
}
export const getUsdcAddress = (securedFinance) => {
	return securedFinance && securedFinance.usdc
}

// Contract objects
export const getMoneyMarketContract = (securedFinance) => {
  	return securedFinance && securedFinance.contracts && securedFinance.contracts.moneyMarket
}
export const getLoanContract = (securedFinance) => {
  	return securedFinance && securedFinance.contracts && securedFinance.contracts.loan
}
export const getFxMarketContract = (securedFinance) => {
  	return securedFinance && securedFinance.contracts && securedFinance.contracts.fxMarket
}
export const getCollateralContract = (securedFinance) => {
	return securedFinance && securedFinance.contracts && securedFinance.contracts.collateral
}
export const getUsdcContract = (securedFinance) => {
	return securedFinance && securedFinance.contracts && securedFinance.contracts.usdc
}

// Approve USDC spending from user account to money market
export const approve = async (usdcContract, moneyMarketContract, account) => {
	return usdcContract.methods
		.approve(moneyMarketContract.options.address, ethers.constants.MaxUint256)
		.send({ from: account })
}

export const getUsdcBalance = async (usdcContract, account) => {
  	return new BigNumber(await usdcContract.methods.balanceOf(account).call())
}

export const getLenderRates = async (moneyMarketContract) => {
  	return moneyMarketContract.methods.getLenderRates().call()
}

export const getBorrowerRates = async (moneyMarketContract) => {
  	return moneyMarketContract.methods.getBorrowerRates().call()
}

export const getMidRates = async (moneyMarketContract) => {
  	return moneyMarketContract.methods.getMidRates().call()
}

export const getDiscountFactors = async (moneyMarketContract) => {
  	return moneyMarketContract.methods.getDiscountFactors().call()
}

export const getLoansHistory = async (loanContract, account) => {
  	return loanContract.methods.getOneBook(account).call()
}

export const getBorrowHistory = async (loanContract, account) => {
	return loanContract.methods.getBorrowerBook(account).call()
}

export const getLoanInfo = async (loanContract, id) => {
	return loanContract.methods.getLoanItem(id).call()
}

export const getBestBook = async (moneyMarketContract) => {
  	return moneyMarketContract.methods.getBestBook().call()
}

export const getFxRates = async (fxMarketContract) => {
	return fxMarketContract.methods.getMidRates().call()
}

export const getCollateralBook = async (collateralContract, account) => {
	return collateralContract.methods.getOneBook(account).call()
}

export const upSizeEth = async (collateralContract, account, amount) => {
	return collateralContract.methods
		.upSizeETH()
		.send({ from: account, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString() })
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const upSizeFil = async (collateralContract, account, amount) => {
	return collateralContract.methods
		.upSizeETH(amount)
		.send({ from: account })
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const setUpCollateral = async (collateralContract, id, filAddr, account, amount) => {
	return collateralContract.methods
		.setColBook(id, filAddr, account)
		.send({ from: account, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()})
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const executeLoan = async (loanContract, account, makerAddr, side, currency, term, amount) => {
	return loanContract.methods
		.makeLoanDeal(makerAddr, side, currency, term, amount)
		.send({ from: account})
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}
