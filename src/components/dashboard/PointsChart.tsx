import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan', issued: 2100, withdrawn: 1200 },
  { month: 'Feb', issued: 2900, withdrawn: 1800 },
  { month: 'Mar', issued: 3250, withdrawn: 2100 },
  { month: 'Apr', issued: 2600, withdrawn: 1900 },
  { month: 'May', issued: 3900, withdrawn: 2400 },
  { month: 'Jun', issued: 4450, withdrawn: 2800 },
];

export function PointsChart() {
  return (
    <div className="audit-card">
      <div className="audit-card-header">
        <h3 className="font-semibold text-foreground">Points: Issued vs Withdrawn</h3>
      </div>
      <div className="audit-card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Bar dataKey="issued" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withdrawn" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
