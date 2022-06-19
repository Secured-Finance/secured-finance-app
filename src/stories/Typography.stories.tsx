import { Meta, Story } from '@storybook/react';

export default {
    title: 'Design System/Typography',
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as Meta;

export const Typography: Story = () => (
    <div className='grid grid-cols-2 place-items-stretch space-y-4 text-white'>
        <div className='border-b'>Class Name:</div>
        <div className='border-b'>Usage</div>

        <div>Hero</div>
        <div className='typography-hero'>Hero</div>

        <div>Headline 1</div>
        <div className='typography-headline1'>Headline 1</div>

        <div>Headline 2</div>
        <div className='typography-headline2'>Headline 2</div>

        <div>Headline 3</div>
        <div className='typography-headline3'>Headline 3</div>

        <div>Body 1</div>
        <div className='typography-body1'>
            Body text large for big paragraphs
        </div>

        <div>Body 2</div>
        <div className='typography-body2'>
            Body text normal, used for most readable content
        </div>

        <div>Caption</div>
        <div className='typography-caption'>
            Caption text, used for very small paragraphs.
        </div>

        <div>Hairline1</div>
        <div className='typography-hairline1'>Hairline Large</div>

        <div>Hairline2</div>
        <div className='typography-hairline2'>Hairline Small</div>

        <div>Button 1</div>
        <div className='typography-button1'>Nav Menu Default</div>

        <div>Button 2</div>
        <div className='typography-button2'>Button Small</div>

        <div>Button 3</div>
        <div className='typography-button3'>Tooltip Large</div>

        <div>Button 4</div>
        <div className='typography-button4'>Pill Label</div>

        <div>Button 5</div>
        <div className='typography-button5'>Button Small</div>

        <div>Button 6</div>
        <div className='typography-button6'>Button Default</div>

        <div>Button 7</div>
        <div className='typography-button7'>Caption 3</div>
    </div>
);
