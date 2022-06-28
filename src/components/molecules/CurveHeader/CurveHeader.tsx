import { CurveHeaderTotal } from 'src/components/atoms/CurveHeaderTotal';
import { ReactComponent as EthIcon } from 'src/assets/coins/eth2.svg';
import { ReactComponent as FilecoinIcon } from 'src/assets/coins/fil.svg';
import { ReactComponent as UsdcIcon } from 'src/assets/coins/usdc.svg';
import { ReactComponent as UsdtIcon } from 'src/assets/coins/usdt.svg';
import { ReactComponent as BitcoinIcon } from 'src/assets/coins/xbc.svg';
import { CurveHeaderAsset } from 'src/components/atoms/CurveHeaderAsset';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { percentFormat, usdFormat } from 'src/utils';

interface CurveHeaderProps {
    asset: string;
    isBorrow: boolean;
}

export const CurveHeader: React.FC<CurveHeaderProps> = ({
    asset,
    isBorrow,
}): JSX.Element => {
    const { price, change } = useSelector(
        (state: RootState) => state.assetPrices.filecoin
    );
    return (
        <div className='flex h-20 w-585 flex-row justify-between p-4'>
            <CurveHeaderAsset
                asset={asset}
                value={usdFormat(price)}
                fluctuation={percentFormat(change)}
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
