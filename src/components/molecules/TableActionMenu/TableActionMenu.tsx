import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { useBreakpoint } from 'src/hooks';
import { OptionalTooltip } from '../Tooltip';

type MenuItem = {
    text: string;
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
};

export const MenuItem = ({
    text,
    onClick,
    disabled = false,
    tooltip,
}: MenuItem) => {
    const isTablet = useBreakpoint('laptop');
    return (
        <OptionalTooltip content={tooltip} fullWidth={isTablet}>
            <Button
                onClick={onClick}
                disabled={disabled}
                size={isTablet ? ButtonSizes.sm : ButtonSizes.xxs}
                fullWidth={isTablet}
                variant={ButtonVariants.secondary}
            >
                {text}
            </Button>
        </OptionalTooltip>
    );
};

export const TableActionMenu = ({ items }: { items: MenuItem[] }) => {
    return (
        <div className='flex w-fit gap-2'>
            {items.map((item, index) => (
                <MenuItem
                    key={index}
                    text={item.text}
                    onClick={item.onClick}
                    disabled={item.disabled}
                    tooltip={item.tooltip}
                />
            ))}
        </div>
    );
};
