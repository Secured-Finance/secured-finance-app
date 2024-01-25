import classNames from 'classnames';
import { HighlightChip } from '../HighlightChip';

interface NavTabProps {
    text: string;
    active: boolean;
    highlight?: {
        text: string;
        size: 'small' | 'large';
        visible: boolean;
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
                    'flex h-full items-center justify-center gap-2 px-[30px]',
                    {
                        'bg-gradient-to-b from-tabGradient2 to-tabGradient1':
                            active,
                    }
                )}
            >
                <p
                    className={classNames(
                        'typography-nav-menu-default h-4 whitespace-nowrap duration-300 group-hover:opacity-100 group-hover:ease-in-out',
                        {
                            'font-semibold text-[#FCFCFD]': active,
                            'text-[#777E90]': !active,
                        }
                    )}
                    data-testid={`${text}-tab`}
                >
                    {text}
                </p>
                {highlight && highlight.visible && (
                    <HighlightChip
                        text={highlight.text}
                        size={highlight.size}
                    />
                )}
            </div>
        </div>
    );
};
