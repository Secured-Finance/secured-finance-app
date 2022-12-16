import { Tab } from 'src/components/molecules';
import { LineChartTab } from 'src/components/organisms';
import { MaturityOptionList } from 'src/types';
import { Rate } from 'src/utils';

const tabDataArray = [
    { text: 'Yield Curve' },
    { text: 'Price History', disabled: true },
];

export const AdvancedLendingOrganism = ({
    maturitiesOptionList,
    rates,
}: {
    maturitiesOptionList: MaturityOptionList;
    rates: Rate[];
}) => {
    return (
        <div className='w-full'>
            <Tab tabDataArray={tabDataArray}>
                <LineChartTab
                    maturitiesOptionList={maturitiesOptionList}
                    rates={rates}
                />
                <div />
            </Tab>
        </div>
    );
};
