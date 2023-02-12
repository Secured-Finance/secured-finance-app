import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { setWalletDialogOpen } from 'src/store/interactions';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Organism/WalletDialog',
    component: WalletDialog,
    decorators: [withWalletProvider],
} as ComponentMeta<typeof WalletDialog>;

const Template: ComponentStory<typeof WalletDialog> = () => {
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
