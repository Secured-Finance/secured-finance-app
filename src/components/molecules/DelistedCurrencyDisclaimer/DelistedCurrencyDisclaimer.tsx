import { TextLink } from 'src/components/atoms';
import { Alert, AlertSeverity } from 'src/components/molecules';
import { generateDelistedCurrencyText } from 'src/components/pages';
import { CurrencySymbol, LOAN_MARKET_PLATFORM_GUIDE_LINK } from 'src/utils';

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
                        <>
                            Please note that&nbsp;
                            {generateDelistedCurrencyText(currencyArray)} will
                            be delisted on Secured Finance.&nbsp;
                            <TextLink
                                href={LOAN_MARKET_PLATFORM_GUIDE_LINK}
                                text='Learn more'
                            />
                        </>
                    }
                    severity={AlertSeverity.Warning}
                    localStorageKey={DELISTED_CURRENCIES_KEY}
                    localStorageValue={[...currencyArray].sort().join()}
                />
            )}
        </>
    );
};
