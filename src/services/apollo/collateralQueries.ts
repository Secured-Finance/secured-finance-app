import { gql } from '@apollo/client';

export const COLLATERAL_BOOK = gql`
    query Collateral($user: Bytes!) {
        collateral (id: $user) {
            id
            userAddressETH
            userAddressFIL
            userAddressUSDC
            collateralAddressFIL
            collateralAddressUSDC
            collateralAmountETH
            collateralAmountFIL
            collateralAmountUSDC
            collateralAmountFILinETH
            collateralAmountUSDCinETH
            inuseETH
            inuseFIL
            inuseUSDC
            inuseFILinETH
            inuseUSDCinETH
            coverage
            isAvailable
            state
        }
    }
`
