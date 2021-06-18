import React from 'react';
import { Story, Meta } from '@storybook/react';
import cm from './index.module.scss';

import { ChipButton, IChipButton } from 'src/components/new/Chip/ChipButton';
import { ChipLabel, IChipLabel } from 'src/components/new/Chip/ChipLabel';

export default {
    title: 'Components/Chips',
    argTypes: { onClick: { action: 'clicked' } },
} as Meta;

export const ChipButtons: Story<IChipButton> = () => (
    <div className={cm.elementsContainer}>
        <ChipButton>Button</ChipButton>
        <ChipButton accent={'purple'}>Button</ChipButton>
        <ChipButton accent={'red'}>Button</ChipButton>
    </div>
);

export const ChipLabels: Story<IChipLabel> = () => (
    <div className={cm.elementsContainer}>
        <ChipLabel label={'Registered'} />
        <ChipLabel label={'Working'} accent={'green'} />
        <ChipLabel label={'Terminated'} accent={'red'} />
        <ChipLabel label={'Closed'} accent={'grey'} />
        <ChipLabel label={'Past Due'} accent={'turquoise'} />
        <ChipLabel label={'Due'} accent={'blue'} />
    </div>
);
