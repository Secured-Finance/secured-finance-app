import { formatFilecoin } from '../formatNumbers';

describe('formatFilecoin', () => {
    it('should convert the input to filecoin', () => {
        const { value, unit } = formatFilecoin(1, 'fil');
        expect(value.toString()).toEqual('1');
        expect(unit).toEqual('FIL');

        const { value: value10, unit: unit10 } = formatFilecoin(10, 'fil');
        expect(value10.toString()).toEqual('10');
        expect(unit10).toEqual('FIL');

        const { value: valuePico, unit: unitPico } = formatFilecoin(
            1,
            'picofil'
        );
        expect(valuePico.toString()).toEqual('0.000000000001');
        expect(unitPico).toEqual('FIL');

        const { value: valueAtto, unit: unitAtto } = formatFilecoin(
            1,
            'attofil'
        );
        expect(valueAtto.toString()).toEqual('0.000000000000000001');
        expect(unitAtto).toEqual('FIL');
    });
    it('should convert attofil to filecoin', () => {
        const { value, unit } = formatFilecoin(1, 'attofil');
        expect(value.toString()).toEqual('0.000000000000000001');
        expect(unit).toEqual('FIL');

        const { value: value10, unit: unit10 } = formatFilecoin(10, 'attofil');
        expect(value10.toString()).toEqual('0.00000000000000001');
        expect(unit10).toEqual('FIL');
    });

    it('should convert picofil to filecoin', () => {
        const { value, unit } = formatFilecoin(1, 'picofil');
        expect(value.toString()).toEqual('0.000000000001');
        expect(unit).toEqual('FIL');

        const { value: value10, unit: unit10 } = formatFilecoin(10, 'picofil');
        expect(value10.toString()).toEqual('0.00000000001');
        expect(unit10).toEqual('FIL');
    });

    it('should convert picofil to attofil', () => {
        const { value, unit } = formatFilecoin(1, 'picofil', 'attofil');
        expect(value.toString()).toEqual('1000000');
        expect(unit).toEqual('ATTOFIL');
    });
});
