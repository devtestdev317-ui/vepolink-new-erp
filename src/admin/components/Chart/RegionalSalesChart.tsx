import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RegionalSales } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';
interface RegionalSalesChartProps {
    data: RegionalSales[];
}

const RegionalSalesChart: React.FC<RegionalSalesChartProps> = ({ data }) => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border rounded-lg shadow-lg">
                    <p className="font-bold text-gray-800">{label} Region</p>
                    <p className="text-green-600">
                        Actual: {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-orange-600">
                        Target: {formatCurrency(payload[1].value)}
                    </p>
                    <p className={`text-sm font-medium ${payload[0].value >= payload[1].value ? 'text-green-600' : 'text-red-600'}`}>
                        Performance: {((payload[0].value / payload[1].value) * 100).toFixed(1)}%
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
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="region"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                    tickFormatter={(value) => `₹${value / 100000}L`}
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
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
                    dataKey="sales"
                    name="Actual Sales"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                />
                <Bar
                    dataKey="target"
                    name="Target"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RegionalSalesChart;