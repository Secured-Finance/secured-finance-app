import classNames from 'classnames';

interface NavTabProps {
    text: string;
    active: boolean;
}

export const NavTab = ({ text, active = false }: NavTabProps) => {
    return (
        <div className='group flex h-full w-full flex-col p-0 text-center'>
            <div className={`h-1 w-full ${active ? 'bg-starBlue' : ''}`}></div>
            <div
                className={`flex h-full items-center justify-center px-8 ${
                    active
                        ? 'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
                        : ''
                }`}
            >
                <p
                    className={classNames(
                        'typography-nav-menu-default h-4 whitespace-nowrap text-neutral-8 duration-300 group-hover:opacity-100 group-hover:ease-in-out',
                        {
                            'opacity-100': active,
                            'opacity-70': !active,
                        }
                    )}
                    data-testid={`${text}-tab`}
                >
                    {text}
                </p>
            </div>
        </div>
    );
};
