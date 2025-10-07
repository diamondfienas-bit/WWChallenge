import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeeklyData } from '../types';

interface ProgressChartProps {
  data: WeeklyData[];
}

const ChartWrapper: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="w-full md:w-1/3 p-2">
    <h4 className="text-sm font-semibold text-center text-gray-700 mb-2">{title}</h4>
    <div className="h-48">
      {children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg text-xs">
          <p className="font-bold text-gray-800 mb-1">{label}</p>
          {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }} className="font-semibold">
              {`${pld.name}: ${pld.value ? pld.value.toFixed(2) : 'N/A'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const chartData = data.map(d => ({
    name: `Week ${d.week}`,
    weight: d.weight && d.weight !== '' ? parseFloat(d.weight as string) : null,
    bmi: d.bmi,
    bodyFatPercentage: d.bodyFatPercentage && d.bodyFatPercentage !== '' ? parseFloat(d.bodyFatPercentage as string) : null,
    muscleMass: d.muscleMass && d.muscleMass !== '' ? parseFloat(d.muscleMass as string) : null,
  }));

  const hasData = chartData.some(d => d.weight || d.bmi || d.bodyFatPercentage || d.muscleMass);

  if (!hasData) {
    return <div className="text-center text-gray-500 py-12">Not enough data to display charts. Please enter some weekly data.</div>;
  }

  return (
    <div className="bg-gray-50/70 p-4 w-full">
        <div className="flex flex-wrap -m-2">
            <ChartWrapper title="Weight (kg)">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                        <Line type="monotone" dataKey="weight" stroke="#84cc16" strokeWidth={2} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>
            
            <ChartWrapper title="BMI">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                        <Line type="monotone" dataKey="bmi" name="BMI" stroke="#22c55e" strokeWidth={2} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper title="Body Fat (%) & Muscle Mass (kg)">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="left" stroke="#f97316" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                        <Line yAxisId="left" type="monotone" dataKey="bodyFatPercentage" name="Body Fat %" stroke="#f97316" strokeWidth={2} connectNulls />
                        <Line yAxisId="right" type="monotone" dataKey="muscleMass" name="Muscle Mass" stroke="#3b82f6" strokeWidth={2} connectNulls />
                    </LineChart>
                </ResponsiveContainer>
            </ChartWrapper>
        </div>
    </div>
  );
};
