import { ComponentMeta, ComponentStory } from '@storybook/react';
import Link from 'next/link';
import { Layout } from './Layout';

export default {
    title: 'Templates/Layout',
    component: Layout,
    args: {
        children: (
            <div className='border-4 border-horizonBlue bg-gunMetal text-white-80'>
                <Link href='/borrowing'>To Borrowing</Link>
            </div>
        ),
        navBar: (
            <div className='bg-red text-center text-4xl text-white'>NavBar</div>
        ),
    },
    argTypes: {
        children: { control: { disable: true } },
        navBar: { control: { disable: true } },
    },
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = args => (
    <Layout navBar={args.navBar}>{args.children}</Layout>
);

export const Default = Template.bind({});
