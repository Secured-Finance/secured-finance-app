import InformationCircle from 'src/assets/icons/information-circle.svg';
import { Tooltip } from 'src/components/templates';

export const InformationPopover = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Tooltip
            iconElement={
                <InformationCircle
                    className='cursor-pointer'
                    data-testid='information-circle'
                    width={12}
                    height={12}
                />
            }
        >
            {children}
        </Tooltip>
    );
};
