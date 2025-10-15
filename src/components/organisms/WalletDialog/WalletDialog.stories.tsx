import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useUIStore } from 'src/store';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Organism/WalletDialog',
    component: WalletDialog,
    decorators: [withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.DESKTOP],
        },
    },
} as Meta<typeof WalletDialog>;

const Template: StoryFn<typeof WalletDialog> = () => {
    const { setWalletDialogOpen } = useUIStore();
    useEffect(() => {
        setWalletDialogOpen(true);
        return () => setWalletDialogOpen(false);
    }, [setWalletDialogOpen]);
    return <WalletDialog />;
};

export const Primary = Template.bind({});
