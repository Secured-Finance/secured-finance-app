import SF from 'src/assets/icons/SF-KO.svg';
import AwardIcon from 'src/assets/icons/award-fill.svg';
import Discord from 'src/assets/icons/discord.svg';
import GitBook from 'src/assets/icons/gitbook.svg';
import Medium from 'src/assets/icons/medium.svg';
import TokenSwapIcon from 'src/assets/icons/token-swap-fill.svg';
import Twitter from 'src/assets/icons/twitter.svg';

type MoreLink = {
    text: string;
    href: string;
    icon: React.ReactNode;
    isInternal?: boolean;
};

export const LinkList: MoreLink[] = [
    {
        text: 'Points',
        href: '/points',
        icon: <AwardIcon className='h-5 w-5' />,
        isInternal: true,
    },
    {
        text: 'Bridge',
        href: '/bridge',
        icon: <TokenSwapIcon className='h-5 w-5' />,
        isInternal: true,
    },
    {
        text: 'Official Site',
        href: 'https://secured.finance/',
        icon: <SF className='h-5 w-5 rounded-full text-white' />,
    },
    {
        text: 'Documentation',
        href: 'https://docs.secured.finance/',
        icon: <GitBook className='h-5 w-5 text-white' />,
    },
    {
        text: 'Articles on Medium',
        href: 'https://blog.secured.finance/',
        icon: <Medium className='h-5 w-5 text-white' />,
    },
    {
        text: 'Follow us on Twitter',
        href: 'https://twitter.com/Secured_Fi',
        icon: <Twitter className='h-5 w-5 text-white' />,
    },
    {
        text: 'Join us on Discord',
        href: 'https://discord.gg/3kytCrv3qY',
        icon: <Discord className='h-5 w-5 text-white' />,
    },
];

export const LOAN_MARKET_PLATFORM_GUIDE_LINK =
    'https://docs.secured.finance/product-guide/loan-market-platform/loan-assets/listing-and-delisting';
