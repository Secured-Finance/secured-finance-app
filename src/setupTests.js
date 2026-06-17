// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'jest-canvas-mock';
import failOnConsole from 'jest-fail-on-console';
import timemachine from 'timemachine';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock('@web3modal/wagmi/react', () => ({
    createWeb3Modal: jest.fn(),
    useWeb3Modal: () => ({
        open: jest.fn(),
        close: jest.fn(),
    }),
}));
jest.mock('wagmi', () => {
    const actual = jest.requireActual('wagmi');
    return {
        ...actual,
        usePublicClient: jest.fn(() => ({
            waitForTransactionReceipt: jest.fn(async ({ hash }) => ({
                blockNumber: hash ? BigInt('123') : BigInt('0'),
                transactionHash: hash,
                status: 'success',
            })),
        })),
    };
});

failOnConsole({
    silenceMessage: errorMessage => {
        return errorMessage.startsWith(
            "Warning: Can't perform a React state update on an unmounted component."
        );
    },
});

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2021-12-01T11:00:00.00Z',
    });
});

afterAll(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    global.gc && global.gc();
});

afterEach(() => {
    cleanup();
});
