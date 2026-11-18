export const pageView = (url: string, gaTag: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', gaTag, {
            page_path: url,
        });
    }
};

type GTagEvent = {
    action: string;
    category: string;
    label: string;
    value?: number;
};

export const event = ({ action, category, label, value }: GTagEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Inline bootstrap for Google Analytics, rendered by _app.tsx.
// _document.tsx puts the hash of this exact string into the Content Security
// Policy, so it must stay a pure function of the tag.
export const getInlineScript = (gaTag: string) => `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaTag}');
    window.addEventListener('hashchange', () => {
        gtag('config', '${gaTag}', {
            page_path: window.location.pathname + window.location.hash,
        });
    });
`;
