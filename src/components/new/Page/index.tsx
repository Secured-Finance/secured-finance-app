import cm from './Page.module.scss';
import React, { HTMLAttributes } from 'react';

type IPage = HTMLAttributes<HTMLDivElement>;

export const Page: React.FC<IPage> = ({ style, children }) => {
    return (
        <div className={cm.page} style={style}>
            {children}
        </div>
    );
};
