import { cleanup, render } from '@testing-library/react';
import { useRef } from 'react';
import { usePreventPageScroll } from './usePreventPageScroll';

function TestComponent() {
    const ref = useRef(null);
    usePreventPageScroll(ref);
    return (
        <div ref={ref} data-testid='test-element'>
            Test Element
        </div>
    );
}

describe('usePreventPageScroll', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    it('adds touchmove event listener', () => {
        render(<TestComponent />);
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'touchmove',
            expect.any(Function),
            { passive: false },
        );
    });
});
