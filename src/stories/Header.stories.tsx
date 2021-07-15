import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Header } from 'src/components/Header';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { default as store } from 'src/store';

export default {
    title: 'Components/Header',
    component: Header,
} as Meta;

export const Default: Story = () => {
    // localStorage.setItem('CACHED_PROVIDER_KEY', 'connected');
    return (
        <Provider store={store}>
            <Router>
                <Header />
            </Router>
        </Provider>
    );
};
