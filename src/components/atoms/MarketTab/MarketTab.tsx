import classNames from 'classnames';

export interface MarketTabProps {
    name: string | number;
    value: string | number;
}

export const MarketTab = ({ name, value }: MarketTabProps) => {
    return (
        <div
            className={`flex h-fit flex-grow flex-col ${
                typeof name === 'string' ? 'gap-1' : ''
            }`}
        >
            <span
                className={classNames({
                    'typography-button-3 leading-7 text-proGreen':
                        typeof name === 'number',
                    'typography-caption-2 text-slateGray':
                        typeof name === 'string',
                })}
            >
                {name}
            </span>
            <span
                className={classNames({
                    'typography-caption font-medium text-neutral-8':
                        typeof value === 'number',
                    'typography-caption-2 font-semibold text-white':
                        typeof value === 'string',
                })}
            >
                {value}
            </span>
        </div>
    );
};
