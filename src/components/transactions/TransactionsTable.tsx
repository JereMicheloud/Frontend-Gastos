
"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategories } from "@/hooks/useCategories";
import type { Transaction } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterDate: Date | undefined;
  setFilterDate: (date: Date | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function TransactionsTable({ 
  transactions, 
  onEdit, 
  onDelete,
  filterCategory,
  setFilterCategory,
  filterDate,
  setFilterDate,
  searchTerm,
  setSearchTerm 
}: TransactionsTableProps) {
  const { categories } = useCategories();

  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const categoryMatch = filterCategory === "all" || getCategoryName(transaction.category_id) === filterCategory;
      
      // Manejo seguro de fechas
      let dateMatch = true;
      if (filterDate) {
        try {
          const transactionDateStr = transaction.transaction_date || transaction.date;
          if (transactionDateStr) {
            const transactionDate = new Date(transactionDateStr);
            if (!isNaN(transactionDate.getTime()) && !isNaN(filterDate.getTime())) {
              dateMatch = format(transactionDate, "yyyy-MM-dd") === format(filterDate, "yyyy-MM-dd");
            }
          } else {
            dateMatch = false;
          }
        } catch (error) {
          dateMatch = false;
        }
      }
      
      const searchMatch = searchTerm === "" || 
                          transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && dateMatch && searchMatch;
    });
  }, [transactions, filterCategory, filterDate, searchTerm, categories]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Input 
          placeholder="Buscar descripciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-auto justify-start text-left font-normal",
                !filterDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, "PPP", { locale: es }) : <span>Filtrar por fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filterDate}
              onSelect={setFilterDate}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
        { (filterCategory !== 'all' || filterDate || searchTerm) && 
          <Button variant="ghost" onClick={() => {setFilterCategory('all'); setFilterDate(undefined); setSearchTerm('');}}>Limpiar Filtros</Button>
        }
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead><span className="sr-only">Acciones</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length > 0 ? filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell>{getCategoryName(transaction.category_id)}</TableCell>
              <TableCell>
                {(() => {
                  const dateStr = transaction.transaction_date || transaction.date;
                  if (!dateStr) return 'Fecha no disponible';
                  try {
                    const date = new Date(dateStr);
                    return isNaN(date.getTime()) ? 'Fecha inválida' : format(date, "dd MMM, yyyy", { locale: es });
                  } catch {
                    return 'Fecha inválida';
                  }
                })()}
              </TableCell>
              <TableCell className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(transaction)} className="cursor-pointer">
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(transaction.id)} className="cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">No se encontraron transacciones que coincidan con los filtros.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
