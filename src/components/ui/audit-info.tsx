import { FaClock as Clock, FaUser as User, FaHistory as History } from 'react-icons/fa';
import { Button } from './button';

interface AuditInfoProps {
  updatedAt: string;
  updatedBy: string;
  onViewHistory?: () => void;
}

export function AuditInfo({ updatedAt, updatedBy, onViewHistory }: AuditInfoProps) {
  return (
    <div className="audit-meta">
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>{updatedAt}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <User className="w-3 h-3" />
        <span>{updatedBy}</span>
      </div>
      {onViewHistory && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-accent hover:text-accent/80"
          onClick={onViewHistory}
        >
          <History className="w-3 h-3 mr-1" />
          View History
        </Button>
      )}
    </div>
  );
}
