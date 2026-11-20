import { createHash } from 'crypto';
import { Head, Html, Main, NextScript } from 'next/document';
import {
    getGoogleAnalyticsTag,
    getGraphqlServerUrl,
    getSubgraphUrl,
    getSupportedNetworks,
} from 'src/utils';
import { buildContentSecurityPolicy } from 'src/utils/csp';
import { getInlineScript } from 'src/utils/gtag';

const sha256 = (content: string) =>
    createHash('sha256').update(content).digest('base64');

// Built once per page at build time, from the same settings the app uses
const getContentSecurityPolicy = () => {
    const gaTag = getGoogleAnalyticsTag();

    return buildContentSecurityPolicy({
        isDevelopment: process.env.NODE_ENV !== 'production',
        rpcUrls: getSupportedNetworks().map(
            chain => chain.rpcUrls.default.http[0]
        ),
        serviceUrls: [getGraphqlServerUrl(), getSubgraphUrl(314)],
        inlineScriptHashes: gaTag ? [sha256(getInlineScript(gaTag))] : [],
    });
};

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <meta charSet='UTF-8' />
                {/* Keep this right after the charset: it only covers what comes after it */}
                <meta
                    httpEquiv='Content-Security-Policy'
                    content={getContentSecurityPolicy()}
                />
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
