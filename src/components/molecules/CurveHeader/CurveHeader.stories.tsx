import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CurrencySymbol } from 'src/utils';
import { CurveHeader } from './CurveHeader';

export default {
    title: 'Molecules/CurveHeader',
    component: CurveHeader,
    args: {
        asset: CurrencySymbol.FIL,
        isBorrow: true,
    },
    argTypes: {},
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof CurveHeader>;

const Template: ComponentStory<typeof CurveHeader> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <CurveHeader {...args} />;
};

export const Default = Template.bind({});
