import { AppProps } from 'next/app';
import '../index.css';

function App({ Component, pageProps }: AppProps) {
    return (
        <div suppressHydrationWarning className='bg-universeBlue text-white'>
            {typeof window === 'undefined' ? null : (
                <Component {...pageProps} />
            )}
        </div>
    );
}

export default App;
