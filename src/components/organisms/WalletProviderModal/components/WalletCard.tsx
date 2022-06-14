import React from 'react';
import {
    Button,
    Card,
    CardContent,
    CardIcon,
    CardTitle,
} from 'src/components/atoms';
import theme from 'src/theme';
import { toKebabCase } from 'src/utils';

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
    <Card data-cy={toKebabCase(title)}>
        <CardContent>
            <CardIcon>{icon}</CardIcon>
            <CardTitle text={title} />
            <Button
                onClick={onConnect}
                style={{
                    background: theme.colors.buttonBlue,
                    fontSize: theme.sizes.callout,
                    fontWeight: 500,
                    color: theme.colors.white,
                }}
            >
                {buttonText ? buttonText : 'Connect'}
            </Button>
        </CardContent>
    </Card>
);

export default WalletCard;
