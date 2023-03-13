import classNames from 'classnames';
import { ordinaryFormat } from 'src/utils';

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
                    'typography-button-3 whitespace-nowrap leading-7 text-proGreen':
                        typeof name === 'number',
                    'typography-caption-2 whitespace-nowrap text-slateGray':
                        typeof name === 'string',
                })}
            >
                {typeof name === 'number' ? name.toFixed(2) : name}
            </span>
            <span
                className={classNames({
                    'typography-caption font-medium text-neutral-8':
                        typeof value === 'number',
                    'typography-caption-2 whitespace-nowrap font-semibold text-white':
                        typeof value === 'string',
                })}
            >
                {typeof value === 'number' ? ordinaryFormat(value, 4) : value}
            </span>
        </div>
    );
};
