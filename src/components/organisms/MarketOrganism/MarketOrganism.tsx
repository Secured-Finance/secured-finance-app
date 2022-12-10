import { Tab } from 'src/components/molecules';
import { LineChartTab } from 'src/components/organisms';
import { MaturityOptionList } from 'src/types';

const tabDataArray = [
    { text: 'Yield Curve' },
    { text: 'Price History', disabled: true },
];

export const MarketOrganism = ({
    maturitiesOptionList,
}: {
    maturitiesOptionList: MaturityOptionList;
}) => {
    return (
        <div className='w-full'>
            <Tab tabDataArray={tabDataArray}>
                <LineChartTab maturitiesOptionList={maturitiesOptionList} />
                <div />
            </Tab>
        </div>
    );
};
