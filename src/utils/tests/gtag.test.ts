import { getInlineScript } from '../gtag';

describe('getInlineScript', () => {
    it('should configure the given tag', () => {
        const script = getInlineScript('G-TEST123');

        expect(script).toContain("gtag('config', 'G-TEST123');");
        expect(script).toContain('window.dataLayer');
    });

    it('should return the same string for the same tag', () => {
        // _document.tsx hashes this string into the Content Security Policy
        expect(getInlineScript('G-TEST123')).toEqual(
            getInlineScript('G-TEST123')
        );
    });
});
