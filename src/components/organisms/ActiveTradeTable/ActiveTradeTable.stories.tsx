import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { aggregatedTrades, efilBytes32 } from 'src/stories/mocks/fixtures';
import { Maturity } from 'src/utils/entities';
import { ActiveTradeTable } from './ActiveTradeTable';

export default {
    title: 'Organism/ActiveTradeTable',
    component: ActiveTradeTable,
    args: {
        data: aggregatedTrades,
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof ActiveTradeTable>;

const Template: ComponentStory<typeof ActiveTradeTable> = args => {
    const now = new Date();
    const twentyTwoHoursFromNow = new Date(now.getTime() + 22 * 60 * 60 * 1000);
    const epochTimestamp = Math.floor(twentyTwoHoursFromNow.getTime() / 1000);

    args.data = [
        ...args.data,
        {
            amount: BigNumber.from('500000000000000000000'),
            currency: efilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(epochTimestamp).toString(),
            averagePrice: BigNumber.from(9671),
        },
    ];

    return (
        <div className='px-24'>
            <ActiveTradeTable {...args} />
        </div>
    );
};

export const Default = Template.bind({});
