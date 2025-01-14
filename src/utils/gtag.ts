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
