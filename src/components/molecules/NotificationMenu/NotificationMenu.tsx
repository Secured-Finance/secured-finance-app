import NotificationIcon from 'src/assets/icons/notification-icon.svg';
import { Badge, MenuItem, Separator } from 'src/components/atoms';
import { MenuPopover } from '../MenuPopover';

export const NotificationMenu = ({
    notifications,
}: {
    notifications: string[];
}) => {
    const notificationIcon = (
        <Badge badgeCount={notifications.length}>
            <NotificationIcon className='h-5 w-5' />
        </Badge>
    );

    const notificationContent = notifications.map((notification, index) => {
        return (
            <>
                <MenuItem text={notification} key={index} />
                {index !== notifications.length - 1 && (
                    <div className='py-2'>
                        <Separator />
                    </div>
                )}
            </>
        );
    });

    return (
        <MenuPopover
            menuButton={notificationIcon}
            menuContent={notificationContent}
        />
    );
};
