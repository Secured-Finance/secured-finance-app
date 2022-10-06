import { TextDecoder } from 'util';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.TextDecoder = TextDecoder;

global.IntersectionObserver = class FakeIntersectionObserver {
    observe() {}
    disconnect() {}
};
