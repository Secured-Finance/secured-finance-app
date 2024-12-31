import { LinkList } from './links';

describe('links', () => {
    it('should have seven links', () => {
        expect(LinkList).toHaveLength(7);
    });
});
