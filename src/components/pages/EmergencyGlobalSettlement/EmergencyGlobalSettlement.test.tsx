import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './EmergencyGlobalSettlement.stories';

const { Default } = composeStories(stories);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

describe('EmergencyGlobalSettlement Component', () => {
    it('should render a EmergencyGlobalSettlement', () => {
        render(<Default />);
    });

    describe('Multi-step termination', () => {
        it('should automatically show the second step if the user does not need to redeem', async () => {
            mock.isRedemptionRequired.mockResolvedValue(false);
            render(<Default />);
            expect(
                await screen.findByTestId('emergency-step-2')
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId('emergency-step-1')
            ).not.toBeInTheDocument();
        });

        it('should go to the first step if the user needs to redeem', async () => {
            mock.isRedemptionRequired.mockResolvedValue(true);
            render(<Default />);
            expect(
                await screen.findByTestId('emergency-step-1')
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId('emergency-step-2')
            ).not.toBeInTheDocument();
        });
    });
});
