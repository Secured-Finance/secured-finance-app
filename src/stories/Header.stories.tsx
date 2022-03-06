import { Meta, Story } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { Header } from 'src/components/Header/Header';
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
