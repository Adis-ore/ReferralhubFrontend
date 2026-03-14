import { cn } from '@/lib/utils';
import { FaCheck as Check } from 'react-icons/fa';

interface ReferralProgressProps {
  currentStep: number; // 1-4
  className?: string;
}

const steps = [
  { label: 'Invited', description: 'Referral signed up' },
  { label: 'Working', description: 'Started shifts' },
  { label: 'Eligible', description: 'Met hours requirement' },
  { label: 'Completed', description: 'Bonus awarded!' },
];

export function ReferralProgress({ currentStep, className }: ReferralProgressProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step.label} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  isCompleted
                    ? 'bg-staff-primary text-white'
                    : isCurrent
                    ? 'bg-staff-primary/20 text-staff-primary border-2 border-staff-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </div>
              <span className={cn(
                'text-xs mt-2 font-medium',
                isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Progress Line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -translate-y-1/2">
        <div
          className="h-full bg-staff-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}
