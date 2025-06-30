"use client";

import { IncomeExpenseTrendChart } from "@/components/analytics/IncomeExpenseTrendChart";
import { SpendingByCategoryChart } from "@/components/analytics/SpendingByCategoryChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTransactionsData } from "@/lib/mock-data";
import type { Transaction } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactionsData);
  const [isMounted, setIsMounted] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'yearly'>('monthly');


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const summary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    // Filtrar transacciones con fechas válidas
    const validTransactions = transactions.filter(t => t.date || t.transaction_date);
    const months = new Set(validTransactions.map(t => {
      const date = t.date || t.transaction_date;
      try {
        return format(new Date(date), 'yyyy-MM');
      } catch {
        return null;
      }
    }).filter(Boolean));
    
    const averageMonthlyExpense = totalExpenses / (months.size || 1);
    return { totalIncome, totalExpenses, netBalance, averageMonthlyExpense };
  }, [transactions]);

  if (!isMounted) {
    return null; // Or a loading skeleton
  }
  
  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-semibold">Análisis Financiero</h1>
        <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as 'monthly' | 'yearly')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Seleccionar período de tiempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensual</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Saldo Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.netBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gasto Mensual Prom.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.averageMonthlyExpense.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeExpenseTrendChart transactions={transactions} timePeriod={timePeriod} />
        <SpendingByCategoryChart transactions={transactions} />
      </div>
      
      {/* Future: Add more charts like savings rate, debt overview, etc. */}
    </div>
  );
}
