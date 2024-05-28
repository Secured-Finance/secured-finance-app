import {
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/solid';
import { AlertSeverity } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=287-8412&mode=dev';

export const severityStyle: { [key in AlertSeverity]: string } = {
    [AlertSeverity.Error]: 'border-error-300 bg-error-500/10',
    [AlertSeverity.Info]: 'border-primary-300 bg-primary-500/10',
    [AlertSeverity.Success]: 'border-success-300 bg-success-700/10',
    [AlertSeverity.Warning]: 'border-warning-300 bg-warning-900/10',
    [AlertSeverity.Basic]: 'border-primary-300 bg-primary-700',
};

export const buttonColorStyle: { [key in AlertSeverity]: string | undefined } =
    {
        [AlertSeverity.Error]: 'text-error-300',
        [AlertSeverity.Info]: 'text-primary-300',
        [AlertSeverity.Success]: 'text-success-300',
        [AlertSeverity.Warning]: 'text-warning-300',
        [AlertSeverity.Basic]: undefined,
    };

export const alertIconMapping: {
    [key in AlertSeverity]: JSX.Element | undefined;
} = {
    [AlertSeverity.Error]: (
        <XCircleIcon className={buttonColorStyle[AlertSeverity.Error]} />
    ),
    [AlertSeverity.Info]: (
        <InformationCircleIcon
            className={buttonColorStyle[AlertSeverity.Info]}
        />
    ),
    [AlertSeverity.Success]: (
        <CheckCircleIcon className={buttonColorStyle[AlertSeverity.Success]} />
    ),
    [AlertSeverity.Warning]: (
        <InformationCircleIcon
            className={buttonColorStyle[AlertSeverity.Warning]}
        />
    ),
    [AlertSeverity.Basic]: undefined,
};
