import {
    fetchRuntimeConfig,
    parseRuntimeConfig,
    resolveRuntimeConfig,
} from '../runtimeConfig';

describe('parseRuntimeConfig', () => {
    it.each([null, 'config', []])(
        'should throw for non-object input: %p',
        raw => {
            expect(() => parseRuntimeConfig(raw)).toThrow(
                'Invalid runtime config: the config must be an object'
            );
        }
    );

    it('should accept an empty config', () => {
        expect(parseRuntimeConfig({})).toEqual({
            incidentAlert: undefined,
            reopeningAlert: undefined,
            pauseAlert: undefined,
            referralMessage: undefined,
        });
    });

    it('should keep valid fields', () => {
        const config = parseRuntimeConfig({
            incidentAlert: {
                message: 'Incident',
                link: 'https://x.com/Secured_Fi',
            },
            reopeningAlert: { message: 'Reopened' },
            pauseAlert: { message: 'Paused' },
            referralMessage: 'Join us',
        });

        expect(config).toEqual({
            incidentAlert: {
                message: 'Incident',
                link: 'https://x.com/Secured_Fi',
            },
            reopeningAlert: { message: 'Reopened', link: undefined },
            pauseAlert: { message: 'Paused' },
            referralMessage: 'Join us',
        });
    });

    it('should trim values so whitespace-only values are empty', () => {
        const config = parseRuntimeConfig({
            incidentAlert: { message: '  Incident  ', link: ' ' },
            pauseAlert: { message: '   ' },
        });

        expect(config.incidentAlert).toEqual({ message: 'Incident', link: '' });
        expect(config.pauseAlert).toEqual({ message: '' });
    });

    it('should keep an empty string so a notice can be cleared on purpose', () => {
        expect(parseRuntimeConfig({ pauseAlert: { message: '' } })).toEqual(
            expect.objectContaining({ pauseAlert: { message: '' } })
        );
    });

    it.each([
        [
            { pauseAlert: { message: 123 } },
            'pauseAlert.message must be a string',
        ],
        [
            { pauseAlert: { message: null } },
            'pauseAlert.message must be a string',
        ],
        [{ pauseAlert: 'Paused' }, 'pauseAlert must be an object'],
        [{ incidentAlert: 'Incident' }, 'incidentAlert must be an object'],
        [{ incidentAlert: [] }, 'incidentAlert must be an object'],
        [
            { reopeningAlert: { message: 'Reopened', link: 1 } },
            'reopeningAlert.link must be a string',
        ],
        [{ referralMessage: ['Join us'] }, 'referralMessage must be a string'],
    ])('should throw for a field of the wrong type: %j', (raw, message) => {
        expect(() => parseRuntimeConfig(raw)).toThrow(
            `Invalid runtime config: ${message}`
        );
    });

    it.each([
        'https://x.com/Secured_Fi',
        'https://x.com/Secured_Fi/status/1',
        'https://x.com/secured_fi/status/1',
        'https://twitter.com/Secured_Fi',
        'https://secured.finance/',
        'https://blog.secured.finance/post',
        'https://medium.com/secured-finance',
        'https://medium.com/secured-finance/postmortem-28bd48e68f22',
    ])('should keep an https link to an allowed host: %s', link => {
        const config = parseRuntimeConfig({
            incidentAlert: { message: 'Incident', link },
        });

        expect(config.incidentAlert?.link).toEqual(link);
    });

    it.each([
        'javascript:alert(1)',
        'JavaScript:alert(1)',
        ' javascript:alert(1)',
        'http://x.com/Secured_Fi',
        'data:text/html,<script>alert(1)</script>',
        '//evil.com',
        'https://secured.finance.evil.com',
        'https://evilsecured.finance',
        'https://x.com@evil.com',
        'https://medium.com/@attacker/fake-withdrawal',
        'https://medium.com/secured-finance-fake/post',
        'https://attacker.medium.com/secured-finance/post-abc123',
        'https://x.com/attacker/status/1',
        'https://x.com/Secured_Fi_fake/status/1',
        'https://mobile.x.com/attacker/status/1',
        'https://evil.com@x.com/Secured_Fi',
        'https://user:pass@secured.finance/',
        'not a url',
    ])('should drop a link that is not allowed: %s', link => {
        const config = parseRuntimeConfig({
            reopeningAlert: { message: 'Reopened', link },
        });

        expect(config.reopeningAlert).toEqual({
            message: 'Reopened',
            link: undefined,
        });
    });
});

describe('resolveRuntimeConfig', () => {
    it('should resolve every value to empty when there is no remote config', () => {
        expect(resolveRuntimeConfig(undefined)).toEqual({
            incidentAlert: { message: '', link: '' },
            reopeningAlert: { message: '', link: '' },
            pauseAlert: { message: '' },
            referralMessage: '',
        });
    });

    it('should resolve fields missing from the remote config to empty', () => {
        const config = resolveRuntimeConfig({
            pauseAlert: {},
            incidentAlert: { message: 'Incident' },
        });

        expect(config.pauseAlert.message).toEqual('');
        expect(config.incidentAlert).toEqual({ message: 'Incident', link: '' });
        expect(config.referralMessage).toEqual('');
    });

    it('should use the remote values', () => {
        const config = resolveRuntimeConfig({
            pauseAlert: { message: 'Remote pause' },
            referralMessage: 'Join us',
        });

        expect(config.pauseAlert.message).toEqual('Remote pause');
        expect(config.referralMessage).toEqual('Join us');
    });
});

describe('fetchRuntimeConfig', () => {
    it('should fetch and parse the config', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ pauseAlert: { message: 'Paused' } }),
        });

        const config = await fetchRuntimeConfig('https://config.test/a.json');

        expect(global.fetch).toHaveBeenCalledWith(
            'https://config.test/a.json',
            expect.objectContaining({ cache: 'no-cache' })
        );
        expect(config.pauseAlert).toEqual({ message: 'Paused' });
    });

    it('should throw when the response is not ok', async () => {
        global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });

        await expect(
            fetchRuntimeConfig('https://config.test/a.json')
        ).rejects.toThrow('Failed to fetch runtime config: 404');
    });

    it('should throw when the config is invalid', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ pauseAlert: { message: 123 } }),
        });

        await expect(
            fetchRuntimeConfig('https://config.test/a.json')
        ).rejects.toThrow('Invalid runtime config');
    });
});
