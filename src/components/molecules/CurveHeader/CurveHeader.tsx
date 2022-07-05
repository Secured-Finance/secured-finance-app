import { useSelector } from 'react-redux';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import UsdtIcon from 'src/assets/coins/usdt.svg';
import BitcoinIcon from 'src/assets/coins/xbc.svg';
import { CurveHeaderAsset, CurveHeaderTotal } from 'src/components/atoms';
import { RootState } from 'src/store/types';

interface CurveHeaderProps {
    asset: string;
    isBorrow: boolean;
}

export const CurveHeader: React.FC<CurveHeaderProps> = ({
    asset = 'Filecoin',
    isBorrow,
}): JSX.Element => {
    const {
        filecoin: { price: filecoinPrice, change: filecoinChange },
        ethereum: { price: ethereumPrice, change: ethereumChange },
        usdc: { price: usdcPrice, change: usdcChange },
    } = useSelector((state: RootState) => state.assetPrices);

    const priceList: Record<string, number> = {
        ethereum: ethereumPrice,
        filecoin: filecoinPrice,
        usdc: usdcPrice,
    };

    const priceChangeList: Record<string, number> = {
        ethereum: ethereumChange,
        filecoin: filecoinChange,
        usdc: usdcChange,
    };

    return (
        <div className='flex h-20 w-[585px] flex-row justify-between p-4'>
            <CurveHeaderAsset
                asset={asset}
                value={priceList[asset.toLowerCase()]}
                fluctuation={priceChangeList[asset.toLowerCase()]}
                IconSVG={getSVGIcon(asset)}
            ></CurveHeaderAsset>
            <div className='flex flex-row gap-2'>
                <CurveHeaderTotal
                    header={
                        isBorrow ? 'Total Borrow (Asset)' : 'Total Lend (Asset)'
                    }
                    footer='80,000,009 FIL'
                />

                <CurveHeaderTotal
                    header={
                        isBorrow ? 'Total Borrow (USD)' : 'Total Lend (USD)'
                    }
                    footer='$650,400,073'
                />
            </div>
        </div>
    );
};

const getSVGIcon = (asset: string) => {
    switch (asset) {
        case 'USD Tether':
            return UsdtIcon;
        case 'Bitcoin':
            return BitcoinIcon;
        case 'Ethereum':
            return EthIcon;
        case 'USDC':
            return UsdcIcon;
        default:
            return FilecoinIcon;
    }
};
