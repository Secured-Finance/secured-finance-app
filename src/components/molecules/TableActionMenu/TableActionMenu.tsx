import { Button, ButtonSizes, ButtonVariants } from 'src/components/atoms';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

export const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size={ButtonSizes.sm}
            fullWidth
            className='min-w-fit'
            variant={ButtonVariants.secondary}
        >
            {text}
        </Button>
    );
};

export const TableActionMenu = ({ items }: { items: MenuItem[] }) => {
    return (
        <div className={`grid grid-cols-${items.length}-actions gap-x-2`}>
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
