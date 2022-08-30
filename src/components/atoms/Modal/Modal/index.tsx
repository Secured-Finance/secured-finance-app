import React from 'react';

export type ModalProps = {
    onDismiss?: () => void;
    ccyIndex?: number;
};

export const Modal: React.FC = ({ children }) => {
    return (
        <div
            className='relative flex flex-col items-center justify-end'
            data-cy='modal'
        >
            <div className='flex w-[650px] flex-col rounded-xl bg-universeBlue py-5'>
                {children}
            </div>
        </div>
    );
};
