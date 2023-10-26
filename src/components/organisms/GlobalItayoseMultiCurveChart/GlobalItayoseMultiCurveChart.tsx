import { MultiCurveChart } from 'src/components/organisms/MultiCurveChart';
import { baseContracts, useLendingMarkets } from 'src/hooks';
import { CurrencySymbol, getCurrencyMapAsList, Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

export const GlobalItayoseMultiCurveChart = () => {
    const curves: Record<string, Rate[]> = {};
    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    getCurrencyMapAsList().forEach(ccy => {
        Object.keys(lendingContracts[ccy.symbol]).forEach(maturity => {
            const contract = lendingContracts[ccy.symbol][Number(maturity)];
            if (contract.isItayosePeriod || contract.isPreOrderPeriod) {
                if (ccy.symbol in curves) {
                    curves[ccy.symbol].push(
                        LoanValue.fromPrice(
                            contract.openingUnitPrice,
                            contract.maturity
                        ).apr
                    );
                } else {
                    curves[ccy.symbol] = [
                        LoanValue.fromPrice(
                            contract.openingUnitPrice,
                            contract.maturity
                        ).apr,
                    ];
                }
            }
        });
    });

    return (
        <div className='w-full'>
            <MultiCurveChart
                title='Yield Curve'
                curves={curves}
                labels={Object.values(lendingContracts[CurrencySymbol.WFIL])
                    .filter(o => o.isPreOrderPeriod || o.isItayosePeriod)
                    .map(o => o.name)}
                isGlobalItayose={true}
            />
        </div>
    );
};
