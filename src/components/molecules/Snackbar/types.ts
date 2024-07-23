export enum SnackbarVariants {
    Error = 'Error',
    Blue = 'Blue',
    Success = 'Success',
    Alert = 'Alert',
    Neutral = 'Neutral',
}

export type SnackbarProps = {
    title?: React.ReactNode;
    message: React.ReactNode;
    variant?: SnackbarVariants;
    duration?: number;
};
