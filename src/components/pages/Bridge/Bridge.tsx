import { Page } from 'src/components/templates';
import { useBreakpoint } from 'src/hooks';
import { squidConfig } from 'src/utils';

export const Bridge = () => {
    const isMobile = useBreakpoint('laptop');
    const configQueryParam = encodeURIComponent(JSON.stringify(squidConfig));

    return (
        <Page title='Bridging Service'>
            <div className='flex items-center justify-center'>
                <div className='overflow-hidden rounded-xl'>
                    <iframe
                        title='squid_widget'
                        width={isMobile ? '390' : '430'}
                        height='684'
                        src={`https://studio.squidrouter.com/iframe?config=${configQueryParam}`}
                    />
                </div>
            </div>
        </Page>
    );
};
