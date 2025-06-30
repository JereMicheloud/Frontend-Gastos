"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Transaction } from "@/types";
import { useCategories } from "@/hooks/useCategories";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface SpendingByCategoryChartProps {
  transactions: Transaction[];
}

export function SpendingByCategoryChart({ transactions }: SpendingByCategoryChartProps) {
  const { categories } = useCategories();
  
  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  };
  
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const dataMap = new Map<string, number>();
    expenses.forEach(t => {
      const categoryName = getCategoryName(t.category_id);
      dataMap.set(categoryName, (dataMap.get(categoryName) || 0) + t.amount);
    });
    return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [transactions, categories]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
      return acc;
    }, {} as ChartConfig);
  }, [chartData]);


  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gasto por Categoría</CardTitle>
          <CardDescription>No hay datos de gastos disponibles para mostrar.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Registra algunos gastos para ver este gráfico.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gasto por Categoría</CardTitle>
        <CardDescription>Desglose visual de tus gastos por categoría.</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] flex items-center justify-center">
        <ChartContainer config={chartConfig} className="w-full aspect-square max-h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" className="text-xs flex-wrap justify-center" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
