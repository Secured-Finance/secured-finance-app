import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './EmergencySettlementStep.stories';

const { Default } = composeStories(stories);

describe('EmergencySettlementStep Component', () => {
    it('should render the step name', () => {
        render(<Default />);
        expect(screen.getByText('1. Do Something first')).toBeInTheDocument();
    });

    it('should render the children', () => {
        render(<Default />);
        expect(screen.getByText('children')).toBeInTheDocument();
    });

    it('should not show the step children when showStep is false', () => {
        render(<Default showStep={false} />);
        expect(screen.queryByText('children')).not.toBeInTheDocument();
    });
});
