import { PortfolioTab } from 'src/components/atoms';

export const PortfolioManagementTable = () => {
    return (
        <div className='flex flex-row drop-shadow-[0_46px_64px_rgba(31,47,70,0.4)]'>
            <PortfolioTab
                name='Net Value'
                value='$0.00'
                orientation='left'
            ></PortfolioTab>
            <PortfolioTab
                name='Net APR'
                value='--'
                orientation='center'
            ></PortfolioTab>
            <PortfolioTab
                name='Net DPR'
                value='--'
                orientation='center'
            ></PortfolioTab>
            <PortfolioTab
                name='Active Contracts'
                value='--'
                orientation='center'
            ></PortfolioTab>
            <PortfolioTab
                name='Net Interest Accrued*'
                value='--'
                orientation='right'
            ></PortfolioTab>
        </div>
    );
};
