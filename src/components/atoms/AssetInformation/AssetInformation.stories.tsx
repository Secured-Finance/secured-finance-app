import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLatestBlock } from 'src/store/blockchain';
import { Currency } from 'src/utils';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import { AssetInformation } from '.';
import AxiosMock from '../../../stories/mocks/AxiosMock';

export default {
    title: 'Atoms/AssetInformation',
    component: AssetInformation,
    args: {
        header: 'Collateral Assets',
        asset: Currency.FIL,
        quantity: 740,
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
    decorators: [
        Story => (
            <AxiosMock
                api={coingeckoApi}
                mock={adapter =>
                    adapter.onGet('/simple/price').reply(200, {
                        ethereum: {
                            usd: 2000.34,
                            usd_24h_change: 0.5162466489453748,
                        },
                        filecoin: {
                            usd: 6.0,
                            usd_24h_change: -8.208519783216566,
                        },
                        'usd-coin': {
                            usd: 1.0,
                            usd_24h_change: 0.042530768538486696,
                        },
                    })
                }
            >
                <Story />
            </AxiosMock>
        ),
    ],
} as ComponentMeta<typeof AssetInformation>;

const Template: ComponentStory<typeof AssetInformation> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <AssetInformation {...args} />;
};

export const Default = Template.bind({});

export const CollateralUtil = Template.bind({});
CollateralUtil.args = {
    header: 'Borrowed Assets',
    asset: Currency.USDC,
    quantity: 12000,
};
