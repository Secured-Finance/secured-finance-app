import Loader from 'src/assets/img/gradient-loader.png';

export const Spinner = () => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={Loader.src} alt='Loader' className='animate-spin'></img>;
};
