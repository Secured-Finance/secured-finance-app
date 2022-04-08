import React, { HTMLAttributes } from 'react';
import cm from './Page.module.scss';

type IPage = HTMLAttributes<HTMLDivElement>;

export const Page: React.FC<IPage & { id: string }> = ({
    style,
    children,
    id,
}) => {
    return (
        <div id={id} data-cy={id} className={cm.page} style={style}>
            {children}
        </div>
    );
};
