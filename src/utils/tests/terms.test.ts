import { getTermsAsOptions } from '../terms';

describe('terms.getTermsAsOptions', () => {
    it('should return the Terms as a list of Option for the ComboBox', () => {
        const options = getTermsAsOptions();
        expect(options).toEqual([
            {
                label: '3 Month',
                value: '3M',
            },
            {
                label: '6 Month',
                value: '6M',
            },
            {
                label: '1 Year',
                value: '1Y',
            },
            {
                label: '2 Year',
                value: '2Y',
            },
            {
                label: '3 Year',
                value: '3Y',
            },
            {
                label: '5 Year',
                value: '5Y',
            },
        ]);
    });
});
