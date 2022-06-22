import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateLatestBlock } from 'src/store/blockchain';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import AxiosMock from '../../../stories/mocks/AxiosMock';
import { LendingCard } from './LendingCard';
export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {},
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
                            usd: 5.87,
                            usd_24h_change: 8.208519783216566,
                        },
                        'usd-coin': {
                            usd: 1.002,
                            usd_24h_change: 0.042530768538486696,
                        },
                    })
                }
            >
                <Story />
            </AxiosMock>
        ),
    ],
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Quick and dirty way to wait for the Mock to be mounted.
        // There must be another way but we barely use Axios in our code.
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);

    return <LendingCard />;
};

export const Default = Template.bind({});
