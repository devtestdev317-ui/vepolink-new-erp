import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RevenueData } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
    data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/70 p-2 rounded-lg shadow-lg">
                    <p className="font-bold text-white text-sm mb-2">{label}</p>
                    <p className="text-white flex items-center gap-2  text-[12px]">
                        <span className="w-3 h-3 bg-blue-600"></span>
                        Actual Revenue: <span className="font-normal text-[12px]">{formatCurrency(payload[0].value)}</span>
                    </p>
                    <p className="text-white flex items-center gap-2  text-[12px]">
                        <span className="w-3 h-3 bg-orange-600"></span>
                        Target: <span className="font-normal text-[12px]">{formatCurrency(payload[1].value)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                />
                <YAxis
                    tickFormatter={(value) => `₹${value / 100000}L`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="rect"
                    iconSize={16}
                    wrapperStyle={{
                        paddingBottom: '50px'
                    }}
                />
                <Bar
                    dataKey="revenue"
                    name="Actual Revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                />
                <Bar
                    dataKey="target"
                    name="Target"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RevenueChart;