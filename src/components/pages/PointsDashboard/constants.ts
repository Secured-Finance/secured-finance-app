export const getShareMessage = (code: string) => {
    const message = `Join the @Secured_Fi Points Program! ✨\n\nSign up through the link below and receive 500 points as a welcome gift! Plus, enjoy a 5% boost on points earned. 🎁\n\n${window.location.origin}${window.location.pathname}?ref=${code}\n\nComplete various quests and earn chances for future $SFT airdrops! 🪂\n`;
    return encodeURIComponent(message);
};

export const quoteTweetUrl =
    'https://x.com/Secured_Fi/status/1803767846973169675';
