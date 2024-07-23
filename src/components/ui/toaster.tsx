'use client';

import { Snackbar } from 'src/components/molecules';
import { ToastProvider, ToastViewport } from 'src/components/ui/toast';
import { useToast } from 'src/components/ui/use-toast';

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
