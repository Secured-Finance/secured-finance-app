import { Tab } from 'src/components/molecules';
import { useCollateralBook } from 'src/hooks';
import { useWallet } from 'use-wallet';
import { CollateralTab } from '../CollateralTab';

const tabDataArray = [{ text: 'Asset Management' }];

export const CollateralOrganism = () => {
    const { account } = useWallet();
    const collateralBook = useCollateralBook(account);

    return (
        <div className='h-fit w-full'>
            <Tab tabDataArray={tabDataArray}>
                <CollateralTab collateralBook={collateralBook} />
            </Tab>
        </div>
    );
};
