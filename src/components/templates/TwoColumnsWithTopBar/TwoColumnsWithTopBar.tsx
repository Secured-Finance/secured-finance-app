import { TwoColumns } from 'src/components/templates';

export const TwoColumnsWithTopBar = ({
    topBar,
    children,
}: {
    topBar: React.ReactNode;
    children: [React.ReactNode, React.ReactNode];
}) => {
    return (
        <div className='h-fit'>
            <div className='w-full'>{topBar}</div>
            <TwoColumns>
                {children[0]}
                {children[1]}
            </TwoColumns>
        </div>
    );
};
