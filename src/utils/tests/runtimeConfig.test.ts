import {
    fetchRuntimeConfig,
    parseRuntimeConfig,
    resolveRuntimeConfig,
} from '../runtimeConfig';

describe('parseRuntimeConfig', () => {
    it('should return an empty config for non-object input', () => {
        expect(parseRuntimeConfig(null)).toEqual({});
        expect(parseRuntimeConfig('config')).toEqual({});
        expect(parseRuntimeConfig([])).toEqual({});
    });

    it('should keep valid fields', () => {
        const config = parseRuntimeConfig({
            incidentAlert: { message: 'Incident', link: 'https://x.com' },
            reopeningAlert: { message: 'Reopened' },
            pauseAlert: { message: 'Paused' },
            referralMessage: 'Join us',
        });

        expect(config).toEqual({
            incidentAlert: { message: 'Incident', link: 'https://x.com' },
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

    it('should drop fields with an unexpected type', () => {
        const config = parseRuntimeConfig({
            incidentAlert: 'Incident',
            pauseAlert: { message: 1 },
            referralMessage: ['Join us'],
        });

        expect(config).toEqual({
            incidentAlert: undefined,
            reopeningAlert: undefined,
            pauseAlert: { message: undefined },
            referralMessage: undefined,
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
});
