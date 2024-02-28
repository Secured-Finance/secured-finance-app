import {
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/solid';
import WarningCircleIcon from 'src/assets/icons/warning-circle.svg';
import { AlertSeverity } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=287-8412&mode=dev';

export const severityStyle: { [key in AlertSeverity]: string } = {
    [AlertSeverity.Error]:
        'border-error-500 bg-error-900/20 light:border-error-300 light:bg-error-50',
    [AlertSeverity.Info]:
        'border-primary-500 bg-primary-900/20 light:bg-primary-50 light:border-primary-300',
    [AlertSeverity.Success]:
        'border-success-500 bg-success-900/20 light:bg-success-50 light:border-success-300',
    [AlertSeverity.Warning]:
        'border-warning-500 bg-warning-900/20 light:bg-warning-50 light:border-warning-300',
};

export const alertIconMapping: { [key in AlertSeverity]: JSX.Element } = {
    [AlertSeverity.Error]: (
        <XCircleIcon className='text-error-300 light:text-error-500' />
    ),
    [AlertSeverity.Info]: (
        <InformationCircleIcon className='text-primary-300 light:text-primary-500' />
    ),
    [AlertSeverity.Success]: (
        <CheckCircleIcon className='text-success-300 light:text-success-700' />
    ),
    [AlertSeverity.Warning]: (
        <WarningCircleIcon className='text-warning-300 light:text-error-700' />
    ),
};
