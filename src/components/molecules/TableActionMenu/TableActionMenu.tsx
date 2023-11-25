import { Button } from 'src/components/atoms';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

const MenuItem = ({ text, onClick, disabled = false }: MenuItem) => {
    return (
        <Button onClick={onClick} disabled={disabled} size='sm'>
            {text}
        </Button>
    );
};
export const TableActionMenu = ({ items }: { items: MenuItem[] }) => {
    return (
        <div className='grid grid-flow-col gap-x-2'>
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
