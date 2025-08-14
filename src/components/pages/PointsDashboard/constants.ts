import { getReferralMessage } from 'src/utils';

export const getShareMessage = (code: string) => {
    const replacements: Record<string, string> = {
        '%URL%': window.location.origin + window.location.pathname,
        '%REF%': code,
    };
    const shareMessage = getReferralMessage().replace(
        /%\w+%/g,
        all => replacements[all] || all
    );
    return encodeURIComponent(shareMessage);
};

export const quoteTweetUrl =
    'https://x.com/Secured_Fi/status/1803767846973169675';
