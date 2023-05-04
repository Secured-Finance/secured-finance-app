/* eslint-disable @next/next/no-img-element */
import Loader from 'src/assets/img/gradient-loader.png';

export const Spinner = () => {
    return (
        <div role='alertdialog' aria-label='Loading'>
            <img src={Loader.src} alt='Loader' className='animate-spin'></img>
        </div>
    );
};
