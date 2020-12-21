import MoneyMarketAbi from './abi/MoneyMarket.json'
import LoanAbi from './abi/Loan.json'
import FxMarketAbi from './abi/FxMarket.json'
import CollateralAbi from './abi/Collateral.json'
// import USDCAbi from './abi/usdc.json'
import {
    contractsAddresses,
    SUBTRACT_GAS_LIMIT,
} from './utils.js'
import * as Types from './types.js'

export class Contracts {
    constructor(provider, networkId, web3, options) {
        this.web3 = web3
        this.defaultConfirmations = options.defaultConfirmations
        this.autoGasMultiplier = options.autoGasMultiplier || 1.5
        this.confirmationType =
        options.confirmationType || Types.ConfirmationType.Confirmed
        this.defaultGas = options.defaultGas
        this.defaultGasPrice = options.defaultGasPrice

        this.moneyMarket = new this.web3.eth.Contract(MoneyMarketAbi)
        this.loan = new this.web3.eth.Contract(LoanAbi)
        this.fxMarket = new this.web3.eth.Contract(FxMarketAbi)
        this.collateral = new this.web3.eth.Contract(CollateralAbi)
        // this.usdc = new this.web3.eth.Contract(USDCAbi)

        this.setProvider(provider, networkId)
        this.setDefaultAccount(this.web3.eth.defaultAccount)
    }

    setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
        contract.setProvider(provider)
        if (address) contract.options.address = address
        else console.error('Contract address not found in network', networkId)
    }

    setProvider(this.moneyMarket, contractsAddresses.moneyMarket)
    setProvider(this.loan, contractsAddresses.loan)
    setProvider(this.fxMarket, contractsAddresses.fxMarket)
    setProvider(this.collateral, contractsAddresses.collateral)
        // setProvider(this.usdc, contractsAddresses.usdc[networkId])
  }

    setDefaultAccount(account) {
        this.moneyMarket.options.from = account
    }

    async setGasLimit() {
        const block = await this.web3.eth.getBlock('latest')
        this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT
    }
}
