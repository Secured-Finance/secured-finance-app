import { ChartIndex } from 'src/components/atoms/ChartIndex';
import { ReactComponent as FilecoinIcon } from 'src/assets/coins/fil.svg';
import { ChartDivs } from 'src/components/atoms/ChartDivs';

export const CurveFilter = (): JSX.Element => {
    return (
        <div className='flex h-20 w-585px flex-row justify-between p-4'>
            <ChartIndex
                asset='Filecoin'
                value='$8.00'
                fluctuation='-2.45%'
                IconSVG={FilecoinIcon}
            ></ChartIndex>
            <div className='flex flex-row gap-2'>
                <ChartDivs
                    header='Total Borrow (Asset)'
                    footer='80,000,009 FIL'
                />

                <ChartDivs header='Total Borrow (USD)' footer='$650,400,073' />
            </div>
        </div>
    );
};
