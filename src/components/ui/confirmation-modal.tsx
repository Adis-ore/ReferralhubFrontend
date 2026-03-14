import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { cn } from '@/lib/utils';
import { FaExclamationTriangle as AlertTriangle, FaCheckCircle as CheckCircle, FaInfoCircle as Info, FaTimesCircle as XCircle } from 'react-icons/fa';

type ModalVariant = 'default' | 'destructive' | 'warning' | 'success';

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: ModalVariant;
  isLoading?: boolean;
  children?: React.ReactNode;
}

const variantConfig: Record<ModalVariant, { icon: React.ComponentType<{ className?: string }>; iconClass: string; buttonClass: string }> = {
  default: {
    icon: Info,
    iconClass: 'text-info',
    buttonClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  destructive: {
    icon: XCircle,
    iconClass: 'text-destructive',
    buttonClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-warning',
    buttonClass: 'bg-warning text-warning-foreground hover:bg-warning/90',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-success',
    buttonClass: 'bg-success text-success-foreground hover:bg-success/90',
  },
};

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  isLoading,
  children,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn('p-2 rounded-full bg-muted', config.iconClass)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              {description && (
                <AlertDialogDescription className="mt-2">
                  {description}
                </AlertDialogDescription>
              )}
            </div>
          </div>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={config.buttonClass}
          >
            {isLoading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
