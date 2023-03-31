import Fail from 'src/assets/icons/failed.svg';

export const FailurePanel = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <span className='typography-body-2 w-full text-center text-white-50'>
                {errorMessage}
            </span>
            <Fail className='h-[100px] w-[100px]' />
        </div>
    );
};
