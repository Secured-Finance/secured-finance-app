import arrow from './arrow.svg';
import chevron from './chevron.svg';
import close from './close.svg';
import darkMode from './dark-mode.svg';
import discord from './discord.svg';
import ethereum from './ethereum.svg';
import filecoin from './filecoin.svg';
import filter from './filter.svg';
import github from './github.svg';
import lightMode from './light-mode.svg';
import like from './like.svg';
import medium from './medium.svg';
import telegram from './telegram.svg';
import twitter from './twitter.svg';
import USD from './USD.svg';
import verified from './verified.svg';
import wallet from './wallet.svg';
import React from 'react';
import { IIcon } from './constants';
import { Logo } from './Logo';

interface ArrowIcon extends IIcon {
    direction?: 'down' | 'up' | 'left' | 'right';
}

const VerifiedIcon: React.FC<IIcon> = ({ fill, size = 24, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
    >
        <path
            d='M23 12L20.56 9.21L20.9 5.52L17.29 4.7L15.4 1.5L12 2.96L8.6 1.5L6.71 4.69L3.1 5.5L3.44 9.2L1 12L3.44 14.79L3.1 18.49L6.71 19.31L8.6 22.5L12 21.03L15.4 22.49L17.29 19.3L20.9 18.48L20.56 14.79L23 12ZM10.09 16.72L6.29 12.91L7.77 11.43L10.09 13.76L15.94 7.89L17.42 9.37L10.09 16.72Z'
            fill={fill}
        />
    </svg>
);

const FilIcon: React.FC<IIcon> = ({ size = 24, fill, ...props }) => (
    <svg
        width={size}
        height={size}
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{
            display: 'flex',
            flexShrink: 0,
        }}
    >
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12 22.0004C6.5 22.0004 2 17.5004 2 11.9504C2.05 6.45041 6.5 1.95041 12.05 2.00041C17.55 2.05041 22 6.50041 22 12.1004C21.95 17.5504 17.5 22.0004 12 22.0004Z'
            fill={fill}
        />
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M12.95 10.8004L12.65 12.4004L15.5 12.8004L15.3 13.5504L12.5 13.1504C12.3 13.8004 12.2 14.5004 11.95 15.1004C11.7 15.8004 11.45 16.5004 11.15 17.1504C10.75 18.0004 10.05 18.6004 9.10001 18.7504C8.55001 18.8504 7.95001 18.8004 7.50001 18.4504C7.35001 18.3504 7.20001 18.1504 7.20001 18.0004C7.20001 17.8004 7.30001 17.5504 7.45001 17.4504C7.55001 17.4004 7.80001 17.4504 7.95001 17.5004C8.10001 17.6504 8.25001 17.8504 8.35001 18.0504C8.65001 18.4504 9.05001 18.5004 9.45001 18.2004C9.90001 17.8004 10.15 17.2504 10.3 16.7004C10.6 15.5004 10.9 14.3504 11.15 13.1504V12.9504L8.50001 12.5504L8.60001 11.8004L11.35 12.2004L11.7 10.6504L8.85001 10.2004L8.95001 9.40041L11.9 9.80041C12 9.50041 12.05 9.25041 12.15 9.00041C12.4 8.10041 12.65 7.20041 13.25 6.40041C13.85 5.60041 14.55 5.10041 15.6 5.15041C16.05 5.15041 16.5 5.30041 16.8 5.65041C16.85 5.70041 16.95 5.80041 16.95 5.90041C16.95 6.10041 16.95 6.35041 16.8 6.50041C16.6 6.65041 16.35 6.60041 16.15 6.40041C16 6.25041 15.9 6.10041 15.75 5.95041C15.45 5.55041 15 5.50041 14.65 5.85041C14.4 6.10041 14.15 6.45041 14 6.80041C13.65 7.85041 13.4 8.95041 13.05 10.0504L15.8 10.4504L15.6 11.2004L12.95 10.8004Z'
            fill={'#000'}
        />
    </svg>
);

export const ArrowIcon: React.FC<ArrowIcon> = ({
    fill = 'white',
    direction,
    size = 24,
}) => {
    const angles: any = {
        left: 0,
        down: -90,
        up: 90,
        right: 180,
    };
    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{
                transform: `rotate(${angles[direction]}deg)`,
            }}
        >
            <path
                d='M8.16656 6L9.47616 7.26804L5.55372 11.0784L22 11.0784L22 12.9217L5.55372 12.9216L9.47616 16.7381L8.16656 18L2 12L8.16656 6Z'
                fill={fill}
                style={{
                    padding: 2,
                }}
            />
        </svg>
    );
};

export {
    arrow,
    chevron,
    close,
    darkMode,
    discord,
    ethereum,
    filecoin,
    filter,
    github,
    lightMode,
    like,
    medium,
    telegram,
    twitter,
    USD,
    verified,
    wallet,
    VerifiedIcon,
    FilIcon,
    Logo,
};
