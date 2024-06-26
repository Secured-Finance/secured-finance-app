import { HorizontalListItem, Section, Separator } from 'src/components/atoms';

export const SectionWithItems = ({
    itemList,
    header,
}: {
    itemList: [React.ReactNode, React.ReactNode][];
    header?: React.ReactNode;
}) => {
    return (
        <Section>
            {header && (
                <div className='mb-2'>
                    {header}
                    <Separator color='neutral-3'></Separator>
                </div>
            )}
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
