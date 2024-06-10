import { TabVariant } from 'src/components/atoms';
import { OrderSideMap } from 'src/types';

export const orderSideOptions = Object.values(OrderSideMap).map(option => ({
    text: option,
    variant: 'Blue' as TabVariant,
}));
