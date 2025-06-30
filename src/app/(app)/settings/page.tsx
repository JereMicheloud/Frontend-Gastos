"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCategoriesData } from "@/lib/mock-data";
import type { Category } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>(mockCategoriesData);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCategory: Category = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '-'), // Simple ID
      name: newCategoryName.trim(),
      icon: '❓',
      color: '#6B7280',
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (categories.find(c => c.id === newCategory.id)) {
      toast({ title: "La categoría ya existe", description: "Este nombre de categoría ya está en uso.", variant: "destructive"});
      return;
    }
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    toast({ title: "Categoría Añadida", description: `${newCategory.name} ha sido añadida.`});
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (categories.length <= 3) { // Prevent deleting all categories
        toast({ title: "No se Puede Eliminar", description: "Se requieren como mínimo 3 categorías.", variant: "destructive"});
        return;
    }
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast({ title: "Categoría Eliminada", description: "La categoría ha sido eliminada.", variant: "destructive"});
  };
  
  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-headline font-semibold">Configuración</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>Gestiona los detalles de tu cuenta (simulado).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">Nombre para Mostrar</Label>
            <Input id="displayName" defaultValue={user?.display_name || ""} disabled />
          </div>
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
          </div>
          <Button disabled>Actualizar Perfil (No Implementado)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestionar Categorías</CardTitle>
          <CardDescription>Añade, edita o elimina tus categorías de transacciones (simulado).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="flex items-center gap-2 mb-4">
            <Input 
              placeholder="Nombre de nueva categoría" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="submit" size="icon">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Añadir Categoría</span>
            </Button>
          </form>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">{category.icon || '📁'}</span>
                  {category.name}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)} disabled={categories.length <=3}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Eliminar {category.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Future: Dark mode toggle, notification preferences, data export/import etc. */}
    </div>
  );
}
