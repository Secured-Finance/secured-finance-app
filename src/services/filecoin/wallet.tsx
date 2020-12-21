import * as wasm from "@zondax/filecoin-signing-tools"
import { Network as FilNetwork } from "@glif/filecoin-address"
import { LotusMessage, SignedLotusMessage } from "@glif/filecoin-message"
import Filecoin, { LocalNodeProvider, WalletSubProvider } from '@glif/filecoin-wallet-provider'
import { MainNetPath, TestNetPath } from "./utils"

interface FilWalletConfig {
    apiAddress: string
    token: string
}

export class FilecoinWallet {
    filecoin: Filecoin
    account: any

	constructor(provider: WalletSubProvider, network: FilNetwork = FilNetwork.TEST) {
        const apiAddr = network == FilNetwork.MAIN ? "https://calibration.node.glif.io" : "http://api.node.glif.io/rpc/v0"
        const config = {
            apiAddress: apiAddr,
            token: '',
        }
        if (provider) {
            this.filecoin = new Filecoin(provider, config)
        } else {
            this.filecoin = new Filecoin(new LocalNodeProvider(config), config)
        }
    }
    

	setProvider = (provider: WalletSubProvider, config: FilWalletConfig) => {
		this.filecoin = new Filecoin(provider, config)
    }
    
	setDefaultAccount = (network: FilNetwork = FilNetwork.TEST, account?: any) => {
        if (account) {
            this.account = account
        } else {
            this.account = this.filecoin.wallet.getAccounts(0, 1, network)
        }
    }

	getDefaultAccount = () => {
		return this.account
    }
    
    getAccounts = (network: FilNetwork = FilNetwork.TEST) => {
        return this.filecoin.wallet.getAccounts(0, 5, network)
    }

    generateMnemonic = () => {
        const mnemonic = wasm.generateMnemonic()
        localStorage.setItem('mnemonic', mnemonic)

        return mnemonic
    }

    getPrivateKey = (network: FilNetwork = FilNetwork.TEST) => {
        const mnemonic = localStorage.getItem('mnemonic')
        const path = network == FilNetwork.MAIN ? MainNetPath : TestNetPath
        return wasm.keyDerive(mnemonic, path, "")
    }

    getBalance = (account?: any) => {
        this.filecoin.getBalance(account)
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)  
        })
    }

    signMessage = (message: LotusMessage) => {
        const _ = this.filecoin.wallet.sign(this.account, message)
        .then((res) => {
            return res
        })
        .catch((err) => {
            console.log(err)
        })
    }
}
