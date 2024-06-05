import { Meta, Story } from '@storybook/react';

export default {
    title: 'Design System/Typography',
    parameters: {
        chromatic: {
            viewports: [1800],
        },
        layout: 'fullscreen',
    },
} as Meta;

export const Typography: Story = () => (
    <div className='grid grid-cols-2 place-items-stretch gap-y-4 text-white'>
        <div className='border-b'>Desktop</div>
        <div className='border-b'>Mobile</div>

        <div className='typography-desktop-display-xxl'>Secured - XXL</div>
        <div className='typography-mobile-display-xxl'>Secured - XXL</div>

        <div className='typography-desktop-display-xl'>Secured - XL</div>
        <div className='typography-mobile-display-xl'>Secured - XL</div>

        <div className='typography-desktop-h-1'>Secured Finance - H1</div>
        <div className='typography-mobile-h-1'>Secured Finance - H1</div>

        <div className='typography-desktop-h-2'>Secured Finance - H2</div>
        <div className='typography-mobile-h-2'>Secured Finance - H2</div>

        <div className='typography-desktop-h-3'>Secured Finance - H3</div>
        <div className='typography-mobile-h-3'>Secured Finance - H3</div>

        <div className='typography-desktop-h-4'>Secured Finance - H4</div>
        <div className='typography-mobile-h-4'>Secured Finance - H4</div>

        <div className='typography-desktop-h-5'>Secured Finance - H5</div>
        <div className='typography-mobile-h-5'>Secured Finance - H5</div>

        <div className='typography-desktop-h-6'>Secured Finance - H6</div>
        <div className='typography-mobile-h-6'>Secured Finance - H6</div>

        <div className='typography-desktop-sh-7'>Secured Finance - SH7</div>
        <div className='typography-mobile-sh-7'>Secured Finance - SH7</div>

        <div className='typography-desktop-sh-8'>Secured Finance - SH8</div>
        <div className='typography-mobile-sh-8'>Secured Finance - SH8</div>

        <div className='typography-desktop-sh-9'>Secured Finance - SH9</div>
        <div className='typography-mobile-sh-9'>Secured Finance - SH9</div>

        <div className='typography-desktop-body-1'>Body 1</div>
        <div className='typography-mobile-body-1'>Body 1</div>

        <div className='typography-desktop-body-2'>Body 2</div>
        <div className='typography-mobile-body-2'>Body 2</div>

        <div className='typography-desktop-body-3'>Body 3</div>
        <div className='typography-mobile-body-3'>Body 3</div>

        <div className='typography-desktop-body-4'>Body 4</div>
        <div className='typography-mobile-body-4'>Body 4</div>

        <div className='typography-desktop-body-5'>Body 5</div>
        <div className='typography-mobile-body-5'>Body 5</div>

        <div className='typography-desktop-body-6'>Body 6</div>
        <div className='typography-mobile-body-6'>Body 6</div>

        <div className='typography-desktop-cta-1'>CTA BODY 1</div>
        <div className='typography-mobile-body-1'>CTA BODY 2</div>

        <div className='typography-desktop-cta-2'>CTA BODY 2</div>
        <div className='typography-mobile-body-2'>CTA BODY 2</div>
    </div>
);
