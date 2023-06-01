import { CloseButton } from 'src/components/atoms';

export const Closable = ({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) => {
    return (
        <>
            <div className='flex justify-end'>
                <CloseButton onClick={onClose} />
            </div>

            {children}
        </>
    );
};
