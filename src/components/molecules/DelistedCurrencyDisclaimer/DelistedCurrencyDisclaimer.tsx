import { TextLink } from 'src/components/atoms';
import { Alert, AlertSeverity } from 'src/components/molecules';
import { generateDelistedCurrencyText } from 'src/components/pages';
import { CurrencySymbol } from 'src/utils';

export const DELISTED_CURRENCIES_KEY = 'DELISTED_CURRENCIES_KEY';

export const DelistedCurrencyDisclaimer = ({
    currencies,
}: {
    currencies: Set<CurrencySymbol>;
}) => {
    const currencyArray = Array.from(currencies);
    return (
        <>
            {currencyArray.length > 0 && (
                <Alert
                    title={
                        <p className='typography-caption text-white'>
                            Please note that&nbsp;
                            {generateDelistedCurrencyText(currencyArray)} will
                            be delisted on Secured Finance.&nbsp;
                            <TextLink
                                href='https://docs.secured.finance/product-guide/loan-market-platform/loan-assets/listing-and-delisting'
                                text='Learn more'
                            />
                        </p>
                    }
                    severity={AlertSeverity.Warning}
                    localStorageKey={DELISTED_CURRENCIES_KEY}
                    localStorageValue={[...currencyArray].sort().join()}
                />
            )}
        </>
    );
};
