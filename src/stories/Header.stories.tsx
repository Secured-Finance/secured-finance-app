import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Header } from 'src/components/Header';
import { HashRouter as Router } from 'react-router-dom';

export default {
    title: 'Components/Header',
    component: Header,
} as Meta;

export const Default: Story = () => {
    localStorage.setItem('CACHED_PROVIDER_KEY', 'connected');
    return (
        <Router>
            <Header />
        </Router>
    );
};
