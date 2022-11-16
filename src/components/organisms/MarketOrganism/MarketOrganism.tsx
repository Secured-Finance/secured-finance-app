import { Option } from 'src/components/atoms';
import { Tab } from 'src/components/molecules';
import { LineChartTab } from 'src/components/organisms';

const tabDataArray = [
    { text: 'Yield Curve' },
    { text: 'Price History', disabled: true },
];

export const MarketOrganism = ({
    maturitiesOptionList,
}: {
    maturitiesOptionList: Option[];
}) => {
    return (
        <Tab tabDataArray={tabDataArray}>
            <LineChartTab maturitiesOptionList={maturitiesOptionList} />
            <div />
        </Tab>
    );
};
