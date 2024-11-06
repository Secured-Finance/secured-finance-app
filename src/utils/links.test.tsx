import { LinkList } from './links';

describe('links', () => {
    it('should have eight links', () => {
        expect(LinkList).toHaveLength(8);
    });
});
