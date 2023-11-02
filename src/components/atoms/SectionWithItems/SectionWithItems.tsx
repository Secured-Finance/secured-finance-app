import { HorizontalListItem, Section } from 'src/components/atoms';

export const SectionWithItems = ({
    itemList,
}: {
    itemList: [React.ReactNode, React.ReactNode][];
}) => {
    return (
        <Section>
            <div className='grid grid-cols-1 gap-2'>
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
