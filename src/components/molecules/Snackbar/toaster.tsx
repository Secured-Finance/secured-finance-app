'use client';

import { Snackbar } from 'src/components/molecules';
import {
    ToastProvider,
    ToastViewport,
} from 'src/components/molecules/Snackbar/toast';
import { useToast } from 'src/components/molecules/Snackbar/use-toast';

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, variant, ...props }) => {
                return (
                    <Snackbar
                        key={id}
                        title={title}
                        message={description}
                        variant={variant}
                        duration={props.duration}
                        {...props}
                    />
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
