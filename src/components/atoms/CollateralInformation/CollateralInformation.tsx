import { useSelector } from 'react-redux';
import { CurrencyIcon } from 'src/components/atoms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';

export interface CollateralInformationProps {
    asset: CurrencySymbol;
    quantity: number;
}

export const CollateralInformation = ({
    asset,
    quantity,
}: CollateralInformationProps) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[asset];

    return (
        <div className='flex h-11 w-full flex-row gap-5'>
            <div>
                <CurrencyIcon ccy={asset} />
            </div>
            <div className='flex w-full flex-row justify-between'>
                <Tab header={asset} footer={currencyMap[asset].name}></Tab>
                <Tab
                    header={`${ordinaryFormat(quantity, 4)} ${asset}`}
                    footer={usdFormat(quantity * price, 2)}
                    align='right'
                ></Tab>
            </div>
        </div>
    );
};

const Tab = ({
    header = '',
    footer = '',
    align = 'left',
}: {
    header: string;
    footer: string;
    align?: 'left' | 'right';
}) => {
    return (
        <div
            className={`flex flex-col ${align === 'right' ? 'text-right' : ''}`}
        >
            <span className='typography-caption h-6 text-neutral-8'>
                {header}
            </span>
            <span className='typography-caption-2 h-5 text-[#6F74B0]'>
                {footer}
            </span>
        </div>
    );
};
