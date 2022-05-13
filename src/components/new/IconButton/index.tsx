import cx from 'classnames';
import React from 'react';
import { arrow } from '../icons';
import cm from './IconButton.module.scss';

export interface IIconButton
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    withBackground?: boolean;
    size?: number;
    icon?: string;
}

export const IconButton: React.FC<IIconButton> = ({
    withBackground,
    size = 18,
    icon = arrow,
    children,
    ...props
}) => {
    return (
        <button
            className={cx(cm.iconButton, {
                [cm.withBackground]: withBackground,
            })}
            {...props}
        >
            <img
                src={icon}
                width={size}
                className={withBackground && cm.iconWithBackground}
                alt=''
            />
        </button>
    );
};
