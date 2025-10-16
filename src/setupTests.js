// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'jest-canvas-mock';
import failOnConsole from 'jest-fail-on-console';
import timemachine from 'timemachine';
import { mockUseCurrencyControllerRead } from './stories/mocks/wagmiMocks';
import {
    mockUseGetUserQuery,
    mockUseVerifyMutation,
    mockUseNonceQuery,
    mockUseGetQuestsQuery,
    mockUseGetUsersQuery,
} from './test-utils/mockPointsClient';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

// Mock wagmi generated hooks
jest.mock('src/generated/wagmi', () => ({
    useCurrencyControllerRead: mockUseCurrencyControllerRead,
}));

// Mock points client generated hooks
jest.mock('src/generated/points', () => ({
    useGetUserQuery: mockUseGetUserQuery,
    useVerifyMutation: mockUseVerifyMutation,
    useNonceQuery: mockUseNonceQuery,
    useGetQuestsQuery: mockUseGetQuestsQuery,
    useGetUsersQuery: mockUseGetUsersQuery,
    GetUserDocument: 'GetUserDocument',
    VerifyDocument: 'VerifyDocument',
    NonceDocument: 'NonceDocument',
    GetQuestsDocument: 'GetQuestsDocument',
    QuestType: {
        ActivePosition: 'ActivePosition',
        DailyLogin: 'DailyLogin',
        Deposit: 'Deposit',
        LimitOrder: 'LimitOrder',
        Referral: 'Referral',
    },
    Network: {
        Arbitrum: 'Arbitrum',
        Sepolia: 'Sepolia',
    },
}));

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
    jest.restoreAllMocks();
});
