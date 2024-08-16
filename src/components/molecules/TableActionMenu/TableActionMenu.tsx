import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';
import { useBreakpoint } from 'src/hooks';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

export const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    const isTablet = useBreakpoint('laptop');
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size={isTablet ? ButtonSizes.sm : ButtonSizes.xxs}
            fullWidth={isTablet}
            variant={ButtonVariants.secondary}
        >
            {text}
        </Button>
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
                />
            ))}
        </div>
    );
};
