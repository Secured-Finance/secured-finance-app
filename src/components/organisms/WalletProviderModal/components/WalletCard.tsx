import React from 'react';
import theme from 'src/theme';
import {
    Button,
    Card,
    CardContent,
    CardIcon,
    CardTitle,
} from 'src/components/atoms';

interface WalletCardProps {
    icon: React.ReactNode;
    onConnect: () => void;
    title: string;
    buttonText?: string;
}

const WalletCard: React.FC<WalletCardProps> = ({
    icon,
    onConnect,
    title,
    buttonText,
}) => (
    <Card>
        <CardContent>
            <CardIcon>{icon}</CardIcon>
            <CardTitle text={title} />
            <Button
                onClick={onConnect}
                text={buttonText ? buttonText : 'Connect'}
                style={{
                    background: theme.colors.buttonBlue,
                    fontSize: theme.sizes.callout,
                    fontWeight: 500,
                    color: theme.colors.white,
                }}
            />
        </CardContent>
    </Card>
);

export default WalletCard;
