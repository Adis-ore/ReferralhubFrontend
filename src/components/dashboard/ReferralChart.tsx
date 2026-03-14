import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', referrals: 42, points: 2100 },
  { month: 'Feb', referrals: 58, points: 2900 },
  { month: 'Mar', referrals: 65, points: 3250 },
  { month: 'Apr', referrals: 52, points: 2600 },
  { month: 'May', referrals: 78, points: 3900 },
  { month: 'Jun', referrals: 89, points: 4450 },
  { month: 'Jul', referrals: 95, points: 4750 },
  { month: 'Aug', referrals: 112, points: 5600 },
  { month: 'Sep', referrals: 98, points: 4900 },
  { month: 'Oct', referrals: 125, points: 6250 },
  { month: 'Nov', referrals: 140, points: 7000 },
  { month: 'Dec', referrals: 158, points: 7900 },
];

export function ReferralChart() {
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <h3 className="font-semibold text-foreground">Referral Trends</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-muted-foreground">Referrals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span className="text-muted-foreground">Points Issued</span>
          </div>
        </div>
      </div>
      <div className="audit-card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReferrals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
                }}
              />
              <Area
                type="monotone"
                dataKey="referrals"
                stroke="hsl(173, 58%, 39%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorReferrals)"
              />
              <Area
                type="monotone"
                dataKey="points"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPoints)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
