import { TabSelector } from 'src/components/molecules';
import { CollateralTab } from 'src/components/organisms';
import { CollateralBook } from 'src/hooks';

const tabDataArray = [{ text: 'Asset Management' }];

export const CollateralOrganism = ({
    collateralBook,
    netAssetValue,
}: {
    collateralBook: CollateralBook;
    netAssetValue: number;
}) => {
    return (
        <div className='h-fit w-full'>
            <TabSelector
                tabDataArray={tabDataArray}
                tabGroupClassName='tablet:max-w-[50%] laptop:max-w-[185px]'
            >
                <CollateralTab
                    collateralBook={collateralBook}
                    netAssetValue={netAssetValue}
                />
            </TabSelector>
        </div>
    );
};
