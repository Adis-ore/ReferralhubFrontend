import { useState, useEffect } from 'react';
import { FaUserFriends, FaChevronDown, FaChevronRight, FaClock, FaCoins, FaSpinner } from 'react-icons/fa';
import { StatusBadge } from '@/components/ui/status-badge';
import { referralsApi } from '@/services/api';
import { toast } from 'sonner';

interface TreeNode {
  referralId: number;
  id: number;
  name: string;
  email: string;
  classification: string;
  status: string;
  hoursWorked: number;
  pointsEarned: number;
  referredAt: string;
  subReferrals: TreeNode[];
}

interface TreeData {
  userId: number;
  userName: string;
  referralCode: string;
  directReferrals: TreeNode[];
  totalReferrals: number;
  levels: number;
}

function TreeNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = node.subReferrals.length > 0;

  const statusMap: Record<string, any> = {
    invited: 'pending',
    working: 'processing',
    eligible: 'approved',
    completed: 'completed',
    rejected: 'rejected',
  };

  return (
    <div className={depth > 0 ? 'ml-6 border-l border-border pl-4 mt-2' : 'mt-2'}>
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors group">
        {/* Expand/collapse toggle */}
        <button
          onClick={() => hasChildren && setExpanded((v) => !v)}
          className={`mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded text-muted-foreground ${
            hasChildren ? 'hover:text-foreground cursor-pointer' : 'cursor-default opacity-30'
          }`}
        >
          {hasChildren ? (
            expanded ? <FaChevronDown className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />
          ) : (
            <span className="w-3 h-3 rounded-full bg-muted-foreground/30 block" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
          {node.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{node.name}</span>
            <StatusBadge status={statusMap[node.status] ?? 'pending'} label={node.status} />
            {hasChildren && (
              <span className="text-xs text-muted-foreground">
                {node.subReferrals.length} sub-referral{node.subReferrals.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{node.email} &bull; {node.classification}</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <FaClock className="w-3 h-3" /> {node.hoursWorked}h worked
            </span>
            {node.pointsEarned > 0 && (
              <span className="flex items-center gap-1 text-xs text-warning">
                <FaCoins className="w-3 h-3" /> {node.pointsEarned.toLocaleString()} pts earned
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              Referred {new Date(node.referredAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-referrals */}
      {expanded && hasChildren && (
        <div>
          {node.subReferrals.map((child) => (
            <TreeNode key={child.referralId} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReferralTreeViewProps {
  userId: number | string;
}

export function ReferralTreeView({ userId }: ReferralTreeViewProps) {
  const [tree, setTree] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    referralsApi.getTree(userId)
      .then(setTree)
      .catch((err) => toast.error(err.message || 'Failed to load referral tree'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
        <FaSpinner className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading referral tree...</span>
      </div>
    );
  }

  if (!tree || tree.directReferrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FaUserFriends className="w-10 h-10 text-muted-foreground/20 mb-3" />
        <p className="text-sm text-muted-foreground">No referrals yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Referrals will appear here once someone uses this staff member's referral code
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary row */}
      <div className="flex items-center gap-6 px-4 py-3 mb-2 rounded-lg bg-muted/30 text-sm">
        <div>
          <span className="text-muted-foreground">Total referrals: </span>
          <span className="font-semibold">{tree.totalReferrals}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Levels deep: </span>
          <span className="font-semibold">{tree.levels}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Referral code: </span>
          <span className="font-mono font-semibold">{tree.referralCode}</span>
        </div>
      </div>

      {/* Tree */}
      <div>
        {tree.directReferrals.map((node) => (
          <TreeNode key={node.referralId} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
