import { composeStories } from '@storybook/testing-react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OpenOrderActionCell.stories';

const { Default } = composeStories(stories);
const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

beforeEach(() => jest.resetAllMocks());

describe('OpenOrderActionCell Component', () => {
    it('should render a OpenOrderActionCell', () => {
        render(<Default />);
    });

    it('should call cancelLendingOrder when clicked', () => {
        render(<Default />);
        expect(mockSecuredFinance.cancelLendingOrder).not.toHaveBeenCalled();
        screen.getByRole('button').click();
        expect(mockSecuredFinance.cancelLendingOrder).toHaveBeenCalled();
    });
});
