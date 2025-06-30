import { useState, useEffect } from 'react';
import { CategoryService, handleApiError } from '@/lib/api';
import { Category, CategoryForm } from '@/types';

/**
 * Hook para manejar categorías
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: CategoryForm): Promise<Category | null> => {
    try {
      const newCategory = await CategoryService.createCategory(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  const updateCategory = async (id: string, data: Partial<CategoryForm>): Promise<Category | null> => {
    try {
      const updatedCategory = await CategoryService.updateCategory(id, data);
      setCategories(prev => 
        prev.map(c => c.id === id ? updatedCategory : c)
      );
      return updatedCategory;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      await CategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(handleApiError(err));
      return false;
    }
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  };
};

/**
 * Hook para obtener una categoría específica
 */
export const useCategory = (id: string | null) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await CategoryService.getCategory(id);
      setCategory(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  return {
    category,
    loading,
    error,
    refreshCategory: fetchCategory,
  };
};

/**
 * Hook para buscar categorías
 */
export const useCategorySearch = (query: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCategories = async () => {
    if (!query.trim()) {
      setCategories([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await CategoryService.searchCategories(query);
      setCategories(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchCategories();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return {
    categories,
    loading,
    error,
  };
};
