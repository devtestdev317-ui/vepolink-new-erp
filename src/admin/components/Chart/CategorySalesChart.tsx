import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CategorySales } from '@/types/dashboard';

interface CategorySalesChartProps {
    data: CategorySales[];
}

const CategorySalesChart: React.FC<CategorySalesChartProps> = ({ data }) => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {

            return (
                <div className="bg-black/80 px-3 py-1 border rounded-lg shadow-lg">
                    <p className='text-white text-sm'>{data[payload[0].name].category}</p>
                    <p className="text-white"><span className={`w-[12px] h-[12px] inline-block mr-1 border`} style={{ backgroundColor: COLORS[payload[0].name] }}></span>{payload[0].value} </p>
                </div>
            );
        }
        return null;
    };

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-600">{data[index].category}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell data-en={entry.category} key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} verticalAlign='top' wrapperStyle={{
                    paddingBottom: '50px'
                }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CategorySalesChart;