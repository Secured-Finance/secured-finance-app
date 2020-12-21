export interface Type {
    side: string, 
    text: string
}

export interface Orders {
    rate: OrderItem,
    amount: OrderItem,
}

export interface OrderItem {
    value: number, 
    label: string
}
