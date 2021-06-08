import badVersion from './badVersion';

describe('badVersion', () => {
    test('it returns true if the version is below the LEDGER_VERSION_MAJOR LEDGER_VERSION_MINOR or LEDGER_VERSION_PATCH', () => {
        expect(
            badVersion({
                major: 0,
                minor: 18,
                patch: 1,
            })
        ).toBe(true);
        expect(
            badVersion({
                major: 0,
                minor: 17,
                patch: 1,
            })
        ).toBe(true);
    });

    test('it returns false if the version is at or above the LEDGER_VERSION_MAJOR LEDGER_VERSION_MINOR or LEDGER_VERSION_PATCH', () => {
        expect(
            badVersion({
                major: 0,
                minor: 18,
                patch: 2,
            })
        ).toBe(false);
        expect(
            badVersion({
                major: 1,
                minor: 19,
                patch: 5,
            })
        ).toBe(false);
    });
});
