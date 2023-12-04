import classNames from 'classnames';

interface TradingViewProps {
    className?: string;
    test: string;
}

export const TradingView = (props: TradingViewProps) => {
    return (
        <div className={classNames(props.className, 'text-white')}>
            <p>Trading View</p>
            <p>TestName: {props.test}</p>
        </div>
    );
};
