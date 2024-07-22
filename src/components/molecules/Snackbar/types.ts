export enum SnackbarVariants {
    Error = 'Error',
    Blue = 'Blue',
    Success = 'Success',
    Alert = 'Alert',
    Neutral = 'Neutral',
}

export type SnackbarProps = {
    title: string;
    message: React.ReactNode;
    variant?: SnackbarVariants;
    open: boolean;
    handleOpen: (value: boolean) => void;
    duration?: number;
};
