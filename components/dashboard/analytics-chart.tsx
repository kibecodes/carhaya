'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import data from "@/data/analytics";

const chartConfig = {
    amt: {
        label: "Amount",
        color: "hsl(var(--chart-2))"
    }
} satisfies ChartConfig;

const AnalyticsChart = () => {
    return ( 
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)} 
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="amt" fill="var(--color-amt)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
 
export default AnalyticsChart;