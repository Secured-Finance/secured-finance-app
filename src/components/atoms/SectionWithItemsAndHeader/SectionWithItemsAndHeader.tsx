import { HorizontalListItem } from '../HorizontalListItem';
import { Section } from '../SectionWithItems/SectionWithItems';
import { Separator } from '../Separator';

export const SectionWithItemsAndHeader = ({
    children,
    itemList,
}: {
    itemList: [React.ReactNode, React.ReactNode][];
    children: React.ReactNode;
}) => {
    return (
        <Section>
            <div className='mb-2'>{children}</div>
            <Separator color='neutral-3'></Separator>
            <div className='mt-2 grid grid-cols-1 gap-2'>
                {itemList.map(([label, value], index) => (
                    <HorizontalListItem
                        key={index}
                        label={label}
                        value={value}
                    />
                ))}
            </div>
        </Section>
    );
};
