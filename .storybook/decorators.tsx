import { Story } from '@storybook/react';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';

export const WithAppLayout = (Story: Story) => {
    const routes = [
        {
            path: '/',
            component: () => <Story />,
        },
    ];
    return <Layout navBar={<Header />} routes={routes} />;
};
