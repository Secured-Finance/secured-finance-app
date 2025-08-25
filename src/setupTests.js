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
