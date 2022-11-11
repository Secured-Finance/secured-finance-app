type TransactionType = 'Borrow' | 'Lend';

export const BorrowLendSelector = ({
    handleButtonClick,
    activeButton = 'Borrow',
}: {
    handleButtonClick: (button: TransactionType) => void;
    activeButton: TransactionType;
}) => {
    return (
        <div className='flex h-12 w-full flex-row items-center gap-1 rounded-lg bg-black-20 p-2'>
            <BorrowLendButton
                selected={activeButton === 'Borrow'}
                buttonText={'Borrow'}
                onClick={button => handleButtonClick(button)}
            />
            <BorrowLendButton
                selected={activeButton === 'Lend'}
                buttonText={'Lend'}
                onClick={button => handleButtonClick(button)}
            />
        </div>
    );
};

const BorrowLendButton = ({
    selected = false,
    buttonText,
    onClick,
}: {
    selected: boolean;
    buttonText: TransactionType;
    onClick: (button: TransactionType) => void;
}) => {
    return (
        <button
            className={`typography-caption-2 group flex h-full w-full items-center justify-center rounded duration-300 hover:opacity-100 hover:ease-in-out ${
                selected
                    ? 'bg-starBlue text-neutral-8'
                    : 'text-neutral-8 opacity-70'
            }`}
            onClick={() => onClick(buttonText)}
        >
            {buttonText}
        </button>
    );
};
