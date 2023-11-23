import { Button } from 'src/components/atoms';

type MenuItem = { text: string; onClick: () => void; disabled?: boolean };

const MenuItem = ({
    text,
    onClick,
    type,
    disabled = false,
}: MenuItem & { type: 'primary' | 'secondary' }) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size='sm'
            variant={type === 'primary' ? 'solid' : 'outlined'}
        >
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
                    type={index === 0 ? 'primary' : 'secondary'}
                />
            ))}
        </div>
    );
};
