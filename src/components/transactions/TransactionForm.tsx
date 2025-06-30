
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import type { Transaction, TransactionForm as TransactionFormType } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (transaction: TransactionFormType) => void;
  onClose?: () => void;
}

export function TransactionForm({ transaction, onSubmit, onClose }: TransactionFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Función para obtener fecha válida
  const getValidDate = (transaction?: Transaction | null): Date => {
    if (!transaction) return new Date();
    
    // Manejar diferentes formatos de fecha
    let dateStr: string | undefined;
    if (typeof transaction === 'object' && transaction !== null) {
      dateStr = transaction.transaction_date || (transaction as any).date;
    }
    
    if (!dateStr) return new Date();
    
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };
  
  const [date, setDate] = useState<Date | undefined>(getValidDate(transaction));
  const [description, setDescription] = useState(transaction?.description || "");
  const [categoryId, setCategoryId] = useState(transaction?.category_id || "");
  const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
  const [type, setType] = useState<'income' | 'expense'>(transaction?.type || "expense");
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setDate(getValidDate(transaction));
      setDescription(transaction.description || "");
      setCategoryId(transaction.category_id || "");
      setAmount(transaction.amount?.toString() || "");
      setType(transaction.type || "expense");
    } else {
      // Reset form for new transaction
      setDate(new Date());
      setDescription("");
      setCategoryId(categories[0]?.id || "");
      setAmount("");
      setType("expense");
    }
  }, [transaction, categories]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || !description || !categoryId || !amount) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor, completa todos los campos obligatorios: Fecha, Descripción, Categoría y Monto.",
        variant: "destructive",
      });
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Monto Inválido",
        description: "Por favor, ingresa un monto numérico positivo válido.",
        variant: "destructive",
      });
      return;
    }

    // Validar que la fecha sea válida
    if (!date || isNaN(date.getTime())) {
      toast({
        title: "Fecha Inválida",
        description: "Por favor, selecciona una fecha válida.",
        variant: "destructive",
      });
      return;
    }

    const submittedTransaction: TransactionFormType = {
      category_id: categoryId,
      amount: numAmount,
      description,
      type,
      transaction_date: date.toISOString().split('T')[0] // YYYY-MM-DD format
    };
    onSubmit(submittedTransaction);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{transaction ? "Editar Transacción" : "Añadir Nueva Transacción"}</DialogTitle>
        <DialogDescription>
          {transaction ? "Actualiza los detalles de tu transacción." : "Ingresa los detalles de tu nuevo ingreso o gasto."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">Tipo</Label>
          <RadioGroup defaultValue={type} onValueChange={(value) => setType(value as 'income' | 'expense')} className="col-span-3 flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="r-expense" />
              <Label htmlFor="r-expense">Gasto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="r-income" />
              <Label htmlFor="r-income">Ingreso</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Descripción</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">Monto ($)</Label>
          <Input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">Categoría</Label>
          <Select value={categoryId} onValueChange={setCategoryId} disabled={categoriesLoading}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "col-span-3 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date && !isNaN(date.getTime()) ? format(date, "PPP", { locale: es }) : <span>Elige una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit">{transaction ? "Guardar Cambios" : "Añadir Transacción"}</Button>
      </DialogFooter>
    </form>
  );
}

