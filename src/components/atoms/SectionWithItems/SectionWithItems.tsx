import { HorizontalListItem } from 'src/components/atoms';

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

export const Section = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='rounded-xl border border-neutral-3'>
            <div className='px-6 py-4'>{children}</div>
        </div>
    );
};
