import { Page } from 'src/components/templates';
import { useBreakpoint } from 'src/hooks';
import { squidConfig } from 'src/utils';

export const Swap = () => {
    const isMobile = useBreakpoint('tablet');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <Page title='Swap'>
            <div className='flex items-center justify-center'>
                <div className='overflow-hidden rounded-xl'>
                    {/* The widget keeps its own origin and can open wallet and
                        explorer tabs, but cannot navigate this page */}
                    <iframe
                        title='squid_widget'
                        sandbox='allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms'
                        width={isMobile ? '370' : '480'}
                        height='684'
                        src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
                    />
                </div>
            </div>
        </Page>
    );
};
