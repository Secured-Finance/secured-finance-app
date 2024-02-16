import { Button } from 'src/components/atoms';
import { ButtonSizes } from 'src/types';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size={ButtonSizes.xs}
            fullWidth
            className='min-w-fit'
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
