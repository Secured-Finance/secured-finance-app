import dynamic from 'next/dynamic';
import { Page } from 'src/components/templates';
import { squidConfig } from 'src/utils';

const SquidWidget = dynamic(() =>
    import('@0xsquid/widget').then(mod => mod.SquidWidget)
);

export const Bridge = () => {
    return (
        <Page title='Bridging Service'>
            <div className='flex items-center justify-center'>
                <div className='flex rounded-[1rem] bg-neutral-900 p-3 shadow-deep'>
                    <SquidWidget config={squidConfig} />
                </div>
            </div>
        </Page>
    );
};
