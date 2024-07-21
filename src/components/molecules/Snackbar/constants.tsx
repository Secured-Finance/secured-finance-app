import {
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/solid';
import { SnackbarVariants } from './types';

export const variantStyle: { [key in SnackbarVariants]: string } = {
    [SnackbarVariants.Error]: 'text-error-300',
    [SnackbarVariants.Blue]: 'text-primary-300',
    [SnackbarVariants.Success]: 'text-success-300',
    [SnackbarVariants.Alert]: 'text-warning-300',
    [SnackbarVariants.Neutral]: 'text-neutral-200',
};

export const snackbarIconMapping: {
    [key in SnackbarVariants]: JSX.Element | undefined;
} = {
    [SnackbarVariants.Error]: <XCircleIcon />,
    [SnackbarVariants.Blue]: <InformationCircleIcon />,
    [SnackbarVariants.Success]: <CheckCircleIcon />,
    [SnackbarVariants.Alert]: <InformationCircleIcon />,
    [SnackbarVariants.Neutral]: <InformationCircleIcon />,
};
