import { LinkList } from './links';

describe('links', () => {
    it('should have five links', () => {
        expect(LinkList).toHaveLength(6);
    });
});
