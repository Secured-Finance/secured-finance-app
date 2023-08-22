import { useDispatch } from 'react-redux';
import { CheckBox } from 'src/components/atoms';
import { setIsBorrowedCollateral } from 'src/store/landingOrderForm';

export const BorrowedCollateral = ({ label }: { label: JSX.Element }) => {
    const dispatch = useDispatch();
    const handleToggleBorrowed = (value: boolean) => {
        dispatch(setIsBorrowedCollateral(value));
    };

    return <CheckBox handleToggle={handleToggleBorrowed}>{label}</CheckBox>;
};
