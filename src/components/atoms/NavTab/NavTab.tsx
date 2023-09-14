import classNames from 'classnames';
import { HighlightChip } from '../HighlightChip';

interface NavTabProps {
    text: string;
    active: boolean;
    highlight?: {
        text: string;
        size: 'small' | 'large';
    };
}

export const NavTab = ({ text, active = false, highlight }: NavTabProps) => {
    return (
        <div className='group flex h-full w-full flex-col text-center'>
            <div
                className={classNames('h-1 w-full', { 'bg-starBlue': active })}
            ></div>
            <div
                className={classNames(
                    'flex h-full items-center justify-center gap-2 px-4',
                    {
                        'bg-gradient-to-b from-tabGradient2 to-tabGradient1':
                            active,
                    }
                )}
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
                {highlight && (
                    <HighlightChip
                        text={highlight.text}
                        size={highlight.size}
                    />
                )}
            </div>
        </div>
    );
};
