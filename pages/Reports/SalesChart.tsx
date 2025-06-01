
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
// Removed SalesDataPoint import as it's too generic; specific data structures are now defined in types.ts
// and data passed to this component should be pre-formatted with 'name' and 'value' (or dataKey) fields.
// import { SalesDataPoint } from '../../types'; 
import { useLanguage } from '../../contexts/LanguageContext';


interface ChartDataBase {
  name: string; // For XAxis in BarChart, or NameKey in PieChart (already translated)
  [key: string]: string | number; // Allows for dynamic dataKey like "sales", "totalAmount"
}

interface SalesChartProps {
  data: ChartDataBase[];
  type: 'bar' | 'pie';
  dataKey: string; // e.g., "sales", "totalAmount"
  // xAxisKey: string; // For BarChart, this is now always 'name' from ChartDataBase
  // nameKey: string; // For PieChart, this is now always 'name' from ChartDataBase
  barColor?: string; 
  barLegendName?: string; // Directly pass the (translated) name for the bar legend
  pieColors?: string[]; 
  valueFormatter?: (value: number) => string; // Optional formatter for Y-axis and tooltip values
}

const SalesChart: React.FC<SalesChartProps> = ({ 
    data, 
    type, 
    dataKey, 
    barColor = "#8884d8", 
    barLegendName, // This should be the already translated name
    pieColors = ["#84cc16", "#22d3ee", "#a855f7", '#ef4444', '#f97316', '#ec4899', '#14b8a6'], // Added more colors
    valueFormatter = (value) => `RM ${Number(value).toFixed(2)}`
}) => {
  const { translate } = useLanguage(); // Retain for any internal translations if necessary

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload; // Raw data point for this segment/bar
      const name = pointData.name; // This 'name' should be pre-translated from the data prop
      const value = payload[0].value; // The numeric value for dataKey

      return (
        <div className="bg-slate-700 p-3 rounded shadow-lg border border-slate-600 text-sm">
          <p className="label text-stone-200 font-semibold">{`${name}`}</p>
          <p className="intro text-green-400">{`${payload[0].name}: ${valueFormatter(value as number)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#9ca3af' }} 
            interval={0} 
            angle={data.length > 7 ? -30 : 0} // Angle ticks if too many items
            textAnchor={data.length > 7 ? "end" : "middle"}
            dy={data.length > 7 ? 10 : 0}
          />
          <YAxis 
            tickFormatter={(value) => valueFormatter(value as number).split(' ')[0] + Number(value).toLocaleString()} // RM10k, RM100 etc.
            tick={{ fontSize: 11, fill: '#9ca3af' }} 
           />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }}/>
          <Legend 
            wrapperStyle={{ fontSize: '12px', color: '#e5e7eb', paddingTop: '10px' }} 
            payload={[{ value: barLegendName || dataKey, type: 'square', color: barColor }]}
          />
          <Bar dataKey={dataKey} fill={barColor} name={barLegendName || dataKey} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}> {/* Adjusted margin for legend */}
          <Pie
            data={data}
            cx="50%"
            cy="45%" // Move pie slightly up to make space for legend at bottom
            labelLine={false}
            outerRadius="75%" // Slightly smaller if legend is tight
            fill="#8884d8"
            dataKey={dataKey}
            nameKey="name" // 'name' in ChartDataBase is pre-translated
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                const percentage = (percent * 100).toFixed(0);
                // Only show label if percentage is significant to avoid clutter
                if (parseInt(percentage) < 5) return null; 
                return (
                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10" fontWeight="medium">
                      {`${data[index].name} (${percentage}%)`}
                    </text>
                );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} stroke={pieColors[index % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconSize={10}
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ fontSize: '11px', color: '#e5e7eb', paddingTop: '0px', paddingBottom: '5px' }}
            payload={
                data.map(
                  (item, index) => ({
                    value: item.name, // Use translated name from data
                    type: "square",
                    color: pieColors[index % pieColors.length]
                  })
                )
              }
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return <p className="text-stone-400 p-4">{translate('module_in_development')}: Invalid chart type or missing keys.</p>;
};

export default SalesChart;
