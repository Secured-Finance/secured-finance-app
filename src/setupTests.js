// Environment setup
process.env.COMMIT_HASH = process.env.COMMIT_HASH || '1234567890';

// Browser API mocks
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.IntersectionObserver = class FakeIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

window.ResizeObserver = global.ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Test utilities
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'jest-canvas-mock';
import failOnConsole from 'jest-fail-on-console';
import timemachine from 'timemachine';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

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
