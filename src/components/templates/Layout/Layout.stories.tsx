import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Link } from 'react-router-dom';
import { Layout } from './Layout';

export default {
    title: 'Templates/Layout',
    component: Layout,
    args: {
        routes: [
            {
                path: '/lending',
                component: () => (
                    <div className='border-4 border-horizonBlue bg-gunMetal text-white-80'>
                        <Link to='/borrowing'>To Borrowing</Link>
                    </div>
                ),
            },
            {
                path: '/borrowing',
                component: () => (
                    <div className='border-4 border-horizonBlue bg-gunMetal text-white-80'>
                        Borrowing
                    </div>
                ),
            },
            {
                path: '/',
                component: () => (
                    <div className='border-4 border-horizonBlue bg-gunMetal text-white-80'>
                        <Link to='/lending'>To Lending</Link>
                    </div>
                ),
            },
        ],
        navBar: (
            <div className='bg-red text-center text-4xl text-white'>NavBar</div>
        ),
    },
    argTypes: {
        routes: { control: { disable: true } },
        navBar: { control: { disable: true } },
    },
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = args => <Layout {...args} />;

export const Default = Template.bind({});
