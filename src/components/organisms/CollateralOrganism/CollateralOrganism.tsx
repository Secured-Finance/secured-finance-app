import { Tab } from 'src/components/molecules';
import { CollateralTab } from '../CollateralTab';

const tabDataArray = [
    { text: 'Collateral Management' },
    { text: 'Scenario Analysis', disabled: true },
];

export const CollateralOrganism = () => {
    return (
        <div className='h-[470px] w-[746px]'>
            <Tab tabDataArray={tabDataArray}>
                <CollateralTab />
                <div />
            </Tab>
        </div>
    );
};
