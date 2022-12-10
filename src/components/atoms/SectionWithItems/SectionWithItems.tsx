import { HorizontalListItem } from 'src/components/atoms';

export const SectionWithItems = ({
    itemList,
}: {
    itemList: [string, string][];
}) => {
    return (
        <Section>
            <div className='grid grid-cols-1 gap-2'>
                {itemList.map(([label, value]) => (
                    <HorizontalListItem
                        key={label}
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
            <div className='py-4 px-6'>{children}</div>
        </div>
    );
};
