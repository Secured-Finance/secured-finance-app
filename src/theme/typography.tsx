import React, { ReactNode } from 'react';
import cm from './theme.scss';

interface IHeadline {
    children: ReactNode;
}

export const Headline: React.FC<IHeadline> = ({ children }) => (
    <span className={cm.headline}>{children}</span>
);
