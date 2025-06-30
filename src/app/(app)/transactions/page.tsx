
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { useTransactions } from "@/hooks/useTransactions";
import type { Transaction, TransactionForm as TransactionFormType } from "@/types";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const { 
    transactions, 
    loading, 
    error, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  // Estados para los filtros de la tabla
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resetFilters = () => {
    setFilterCategory("all");
    setFilterDate(undefined);
    setSearchTerm("");
  };

  const handleAddTransaction = async (newTransactionData: TransactionFormType) => {
    const result = await createTransaction(newTransactionData);
    if (result) {
      setIsModalOpen(false);
      toast({ 
        title: "Transacción Añadida", 
        description: `${newTransactionData.description} ha sido añadida exitosamente.` 
      });
      resetFilters();
    } else if (error) {
      toast({ 
        title: "Error", 
        description: error,
        variant: "destructive"
      });
    }
  };

  const handleEditTransaction = async (updatedTransaction: TransactionFormType) => {
    if (!editingTransaction) return;
    
    const result = await updateTransaction(editingTransaction.id, updatedTransaction);
    if (result) {
      setIsModalOpen(false);
      setEditingTransaction(null);
      toast({ 
        title: "Transacción Actualizada", 
        description: `${updatedTransaction.description} ha sido actualizada exitosamente.` 
      });
    } else if (error) {
      toast({ 
        title: "Error", 
        description: error,
        variant: "destructive" 
      });
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")) {
      const success = await deleteTransaction(transactionId);
      if (success) {
        toast({ 
          title: "Transacción Eliminada", 
          description: "La transacción ha sido eliminada.", 
          variant: "destructive" 
        });
      } else if (error) {
        toast({ 
          title: "Error", 
          description: error,
          variant: "destructive" 
        });
      }
    }
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  }

  if (!isMounted) {
    return null; // O un esqueleto de carga
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold">Transacciones</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Transacción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <TransactionForm 
              transaction={editingTransaction} 
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de Transacciones</CardTitle>
          <CardDescription>Ver, gestionar y filtrar tus ingresos y gastos.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable 
            transactions={transactions} 
            onEdit={openEditModal} 
            onDelete={handleDeleteTransaction}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </CardContent>
      </Card>
    </div>
  );
}
