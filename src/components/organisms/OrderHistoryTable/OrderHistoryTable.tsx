import { OrderHistoryQuery } from '@secured-finance/sf-graph-client/dist/graphclients';

export const OrderHistoryTable = ({
    data,
}: {
    data: OrderHistoryQuery['orders'] | undefined;
}) => {
    return (
        <div>
            {data?.map(order => (
                <div key={order.id}>
                    <div>{order.maker}</div>
                    <div>{order.amount}</div>
                </div>
            ))}
        </div>
    );
};
