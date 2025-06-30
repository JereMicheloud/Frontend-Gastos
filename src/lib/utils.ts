import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// === UTILIDADES PARA TRANSACCIONES ===

/**
 * Obtiene la fecha de una transacción, manejando compatibilidad
 */
export const getTransactionDate = (transaction: Transaction): string => {
  return transaction.transaction_date || transaction.date || "";
};

/**
 * Obtiene el nombre de la categoría de una transacción
 */
export const getTransactionCategoryName = (transaction: Transaction): string => {
  if (transaction.category && typeof transaction.category === "object") {
    return transaction.category.name;
  }
  // Fallback para compatibilidad con datos antiguos
  return String(transaction.category || "Sin categoría");
};

/**
 * Obtiene el ID de la categoría de una transacción
 */
export const getTransactionCategoryId = (transaction: Transaction): string => {
  if (transaction.category && typeof transaction.category === "object") {
    return transaction.category.id;
  }
  return transaction.category_id || "";
};

/**
 * Convierte una transacción al nuevo formato
 */
export const normalizeTransaction = (transaction: any): Transaction => {
  return {
    ...transaction,
    transaction_date: transaction.transaction_date || transaction.date,
    date: transaction.transaction_date || transaction.date, // Para compatibilidad
  };
};
