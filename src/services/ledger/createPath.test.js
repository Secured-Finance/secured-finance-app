import { Network } from '@glif/filecoin-address';
import createPath from './createPath';

describe('createPath', () => {
    test('it creates a path based on an index and networkID', () => {
        expect(createPath(Network.TEST, 1)).toBe("m/44'/1'/0'/0/1");
        expect(createPath(Network.MAIN, 2)).toBe("m/44'/461'/0'/0/2");
    });

    test('it hardens the first three path values', () => {
        const path = createPath(Network.TEST, 1).split('/');
        expect(path[0][path[0].length - 1]).not.toBe("'");
        expect(path[1][path[1].length - 1]).toBe("'");
        expect(path[2][path[2].length - 1]).toBe("'");
        expect(path[3][path[3].length - 1]).toBe("'");
        expect(path[4][path[4].length - 1]).not.toBe("'");
        expect(path[5][path[5].length - 1]).not.toBe("'");
    });
});
