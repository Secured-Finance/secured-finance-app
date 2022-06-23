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
                    <div>
                        <Link to='/borrowing'>To Borrowing</Link>
                    </div>
                ),
            },
            {
                path: '/borrowing',
                component: () => <div>Borrowing</div>,
            },
            {
                path: '/',
                component: () => <Link to='/lending'>To Lending</Link>,
            },
        ],
        navBar: <div>NavBar</div>,
    },
    argTypes: {
        routes: { control: { disable: true } },
        navBar: { control: { disable: true } },
    },
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = args => <Layout {...args} />;

export const Default = Template.bind({});
