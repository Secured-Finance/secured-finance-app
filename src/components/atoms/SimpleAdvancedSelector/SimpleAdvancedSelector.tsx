type ViewType = 'Simple' | 'Advanced';

export const SimpleAdvancedSelector = ({
    handleButtonClick,
    activeButton = 'Simple',
}: {
    handleButtonClick: (button: ViewType) => void;
    activeButton: ViewType;
}) => {
    return (
        <div className='flex h-10 w-fit flex-row items-center rounded-full bg-black-20 p-[2px] shadow-selector'>
            <SimpelAdvancedButton
                selected={activeButton === 'Simple'}
                onClick={button => handleButtonClick(button)}
                buttonText='Simple'
            />
            <SimpelAdvancedButton
                selected={activeButton === 'Advanced'}
                onClick={button => handleButtonClick(button)}
                buttonText='Advanced'
            />
        </div>
    );
};

const SimpelAdvancedButton = ({
    selected = false,
    buttonText,
    onClick,
}: {
    selected: boolean;
    buttonText: ViewType;
    onClick: (button: ViewType) => void;
}) => {
    return (
        <button
            className={`typography-caption flex h-full w-[100px] items-center justify-center rounded-full duration-300 hover:opacity-100 hover:ease-in-out ${
                selected ? 'bg-starBlue text-white' : 'text-white opacity-40'
            }`}
            onClick={() => onClick(buttonText)}
        >
            {buttonText}
        </button>
    );
};
