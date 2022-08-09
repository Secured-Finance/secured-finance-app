import { useSelector } from 'react-redux';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { currencyMap, CurrencySymbol, usdFormatAppendUSD } from 'src/utils';

interface AssetInformationProps {
    header: string;
    asset: CurrencySymbol;
    quantity: number;
}

export const AssetInformation: React.FC<AssetInformationProps> = ({
    header,
    asset,
    quantity,
}) => {
    const currencyInfo = currencyMap[asset];
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[asset];

    return (
        <div className='flex h-fit w-[216px] flex-col gap-2'>
            <div className='typography-caption-3 h-[26px] w-full border-b border-white-10 text-white-50'>
                {header}
            </div>
            <div className='flex h-10 w-full flex-row items-center gap-3'>
                <div>
                    <currencyInfo.icon className='h-7 w-7' />
                </div>
                <div className='flex w-full flex-row justify-between'>
                    <Tab
                        header={asset}
                        footer={usdFormatAppendUSD(price, 2)}
                    ></Tab>
                    <Tab
                        header={`${quantity} ${asset}`}
                        footer={usdFormatAppendUSD(quantity * price)}
                        align='right'
                    ></Tab>
                </div>
            </div>
        </div>
    );
};

const Tab = ({ header = '', footer = '', align = 'left' }) => {
    return (
        <div
            className={`typography-caption-2 flex flex-col ${
                align === 'right' ? 'text-right' : ''
            }`}
        >
            <span className='h-5 text-[#FAFAFA]'>{header}</span>
            <span className='h-5 text-[#6F74B0]'>{footer}</span>
        </div>
    );
};
