import { TextDecoder, TextEncoder } from 'util';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

global.IntersectionObserver = class FakeIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

window.ResizeObserver = global.ResizeObserver;
