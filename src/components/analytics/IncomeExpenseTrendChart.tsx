"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Transaction } from "@/types";
import { format } from "date-fns";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface IncomeExpenseTrendChartProps {
  transactions: Transaction[];
  timePeriod?: 'monthly' | 'yearly'; // Add more periods if needed
}

export function IncomeExpenseTrendChart({ transactions, timePeriod = 'monthly' }: IncomeExpenseTrendChartProps) {
  const chartData = useMemo(() => {
    const dataMap = new Map<string, { dateLabel: string; income: number; expenses: number }>();
    
    transactions.forEach(t => {
      const dateStr = t.date || t.transaction_date;
      if (!dateStr) return;
      
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        
        const dateLabel = timePeriod === 'monthly' ? format(date, "MMM yy") : format(date, "yyyy");
        if (!dataMap.has(dateLabel)) {
          dataMap.set(dateLabel, { dateLabel, income: 0, expenses: 0 });
        }
        const entry = dataMap.get(dateLabel)!;
        if (t.type === 'income') {
          entry.income += t.amount;
        } else {
          entry.expenses += t.amount;
        }
      } catch (error) {
        console.warn('Invalid date in transaction:', dateStr);
      }
    });
    
    return Array.from(dataMap.values()).sort((a, b) => new Date(a.dateLabel).getTime() - new Date(b.dateLabel).getTime()).slice(-12); // Show last 12 periods
  }, [transactions, timePeriod]);

  const chartConfig = {
    income: { label: "Ingresos", color: "hsl(var(--chart-1))" },
    expenses: { label: "Gastos", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  if (chartData.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ingresos vs. Gastos</CardTitle>
          <CardDescription>No hay datos de transacciones disponibles para mostrar.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Registra algunas transacciones para ver este gráfico.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Ingresos vs. Gastos</CardTitle>
        <CardDescription>Comparación de tus ingresos y gastos a lo largo del tiempo ({timePeriod === 'monthly' ? 'últimos 12 meses' : 'últimos 12 años'}).</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dateLabel" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
