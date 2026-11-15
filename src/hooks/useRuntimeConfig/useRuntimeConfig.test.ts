import {
    initialRuntimeConfig,
    mockRuntimeConfig,
} from 'src/stories/mocks/runtimeConfigMock';
import { renderHook, waitFor } from 'src/test-utils';
import { useRuntimeConfig } from './useRuntimeConfig';

describe('useRuntimeConfig hook', () => {
    it('should resolve to empty values until the config loads', () => {
        global.fetch = jest.fn(() => new Promise<Response>(() => undefined));

        const { result } = renderHook(() => useRuntimeConfig());

        expect(result.current.pauseAlert.message).toEqual('');
    });

    it('should return the values from the fetched config', async () => {
        mockRuntimeConfig({ pauseAlert: { message: 'Remote pause' } });

        const { result } = renderHook(() => useRuntimeConfig());

        await waitFor(() =>
            expect(result.current.pauseAlert.message).toEqual('Remote pause')
        );
        expect(global.fetch).toHaveBeenCalledWith(
            process.env.NEXT_PUBLIC_RUNTIME_CONFIG_URL,
            expect.objectContaining({ cache: 'no-cache' })
        );
    });

    it('should return the default mock config when a test sets none', async () => {
        const { result } = renderHook(() => useRuntimeConfig());

        await waitFor(() =>
            expect(result.current.referralMessage).toEqual(
                initialRuntimeConfig.referralMessage
            )
        );
        expect(result.current.pauseAlert.message).toEqual('');
    });

    it('should keep the default values a test does not override', async () => {
        mockRuntimeConfig({ pauseAlert: { message: 'Remote pause' } });

        const { result } = renderHook(() => useRuntimeConfig());

        await waitFor(() =>
            expect(result.current.pauseAlert.message).toEqual('Remote pause')
        );
        expect(result.current.referralMessage).toEqual(
            initialRuntimeConfig.referralMessage
        );
    });

    it('should resolve to empty values when the fetch fails', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('network'));

        const { result } = renderHook(() => useRuntimeConfig());

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
        expect(result.current.pauseAlert.message).toEqual('');
    });

    it('should not fetch when no config url is set', () => {
        const url = process.env.NEXT_PUBLIC_RUNTIME_CONFIG_URL;
        process.env.NEXT_PUBLIC_RUNTIME_CONFIG_URL = '';

        const { result } = renderHook(() => useRuntimeConfig());

        expect(global.fetch).not.toHaveBeenCalled();
        expect(result.current.pauseAlert.message).toEqual('');

        process.env.NEXT_PUBLIC_RUNTIME_CONFIG_URL = url;
    });
});
