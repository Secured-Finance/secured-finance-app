export const EmergencySettlementStep = ({
    step,
    showStep,
    children,
}: {
    step: string;
    showStep: boolean;
    children: React.ReactNode;
}) => {
    return (
        <div className='grid grid-flow-row rounded-b-2xl border border-white-10 bg-cardBackground/60 pb-5 text-white shadow-tab'>
            <h1 className='typography-body-2 px-4 pb-6 pt-5'>{step}</h1>
            {showStep && children}
        </div>
    );
};
