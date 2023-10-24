export const TextLink = ({ text, href }: { text: string; href: string }) => {
    return (
        <a
            className='whitespace-nowrap text-secondary7 underline'
            href={href}
            target='_blank'
            rel='noreferrer'
        >
            {text}
        </a>
    );
};
