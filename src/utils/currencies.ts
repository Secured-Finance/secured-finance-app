import usdcLogo from '../assets/coins/usdc.png'
import ethLogo from '../assets/coins/eth.png'
import filLogo from '../assets/coins/fil.png'

export interface CurrencyInfo {
    index: number,
    icon: string,
    shortName: string,
    fullName: string,
}

export const currencyList = [
    {
        index: 0,
        icon: ethLogo,
        shortName: "ETH",
        fullName: "Ethereum"
    },
    {
        index: 1,
        icon: filLogo,
        shortName: "FIL",
        fullName: "Filecoin"
    },
    {
        index: 2,
        icon: usdcLogo,
        shortName: "USDC",
        fullName: "USDC"
    },
] as Array<CurrencyInfo>

export const collateralList = [
    {
        index: 0,
        icon: ethLogo,
        shortName: "ETH",
        fullName: "Ethereum"
    },
    {
        index: 2,
        icon: usdcLogo,
        shortName: "USDC",
        fullName: "USDC"
    },
] as Array<CurrencyInfo>
