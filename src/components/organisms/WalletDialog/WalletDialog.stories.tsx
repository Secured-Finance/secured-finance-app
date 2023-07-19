import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWalletDialogOpen } from 'src/store/interactions';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Organism/WalletDialog',
    component: WalletDialog,
    decorators: [withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof WalletDialog>;

const Template: StoryFn<typeof WalletDialog> = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setWalletDialogOpen(true));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);
    return <WalletDialog />;
};

export const Primary = Template.bind({});
