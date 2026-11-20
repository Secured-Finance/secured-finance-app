import { reportCspViolations, toCspViolation } from '../cspReporter';

const violation = (
    blockedURI: string,
    effectiveDirective = 'connect-src',
    sourceFile = ''
) => ({
    effectiveDirective,
    violatedDirective: effectiveDirective,
    blockedURI,
    sourceFile,
});

describe('toCspViolation', () => {
    it('should keep only the origin of a blocked URL', () => {
        expect(
            toCspViolation(
                violation(
                    'https://evil.example.com/path?address=0xabc',
                    'connect-src',
                    'https://app.secured.finance/_next/static/chunk.js'
                )
            )
        ).toEqual({
            directive: 'connect-src',
            blocked: 'https://evil.example.com',
            source: 'https://app.secured.finance',
        });
    });

    it('should keep keywords such as inline and eval', () => {
        expect(toCspViolation(violation('inline', 'script-src')).blocked).toBe(
            'inline'
        );
        expect(toCspViolation(violation('eval', 'script-src')).blocked).toBe(
            'eval'
        );
        expect(toCspViolation(violation('')).blocked).toBe('unknown');
    });
});

describe('reportCspViolations', () => {
    const setup = () => {
        const target = new EventTarget();
        const track = jest.fn();
        const stop = reportCspViolations(track, target as unknown as Document);
        const fire = (blockedURI: string, directive = 'connect-src') =>
            target.dispatchEvent(
                Object.assign(
                    new Event('securitypolicyviolation'),
                    violation(blockedURI, directive)
                )
            );
        return { track, stop, fire };
    };

    it('should report each blocked origin once per page', () => {
        const { track, fire } = setup();

        fire('https://a.example.com/1');
        fire('https://a.example.com/2');
        fire('https://b.example.com/');

        expect(track).toHaveBeenCalledTimes(2);
    });

    it('should cap the number of reports', () => {
        const { track, fire } = setup();

        for (let i = 0; i < 30; i++) fire(`https://h${i}.example.com/`);

        expect(track).toHaveBeenCalledTimes(10);
    });

    it('should stop reporting after cleanup', () => {
        const { track, stop, fire } = setup();

        stop();
        fire('https://a.example.com/');

        expect(track).not.toHaveBeenCalled();
    });
});
