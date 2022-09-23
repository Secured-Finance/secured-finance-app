import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <meta charSet='UTF-8' />
                <meta
                    name='description'
                    content='Secured Finance - Interbank-grade financial transaction platform'
                />
                <link rel='shortcut icon' href='/favicon.ico' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/favicon-32x32.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/favicon-16x16.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='192x192'
                    href='/android-chrome-192x192.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='512x512'
                    href='/android-chrome-512x512.png'
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
