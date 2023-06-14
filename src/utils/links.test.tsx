import { LinkList } from './links';

describe('links', () => {
    it('should have four links', () => {
        expect(LinkList).toHaveLength(4);
    });
});
