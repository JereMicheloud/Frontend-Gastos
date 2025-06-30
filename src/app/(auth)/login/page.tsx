"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DevModeAlert } from "@/components/DevModeAlert";
import { APP_ICON, APP_NAME } from "@/config/nav";
import { useAuth } from "@/contexts/AuthContext";
import { handleApiError } from "@/lib/api";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <DevModeAlert />
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <APP_ICON className="h-10 w-10 text-primary" />
          <CardTitle className="font-headline text-3xl">{APP_NAME}</CardTitle>
        </div>
        <CardDescription>Ingresa tus credenciales para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="usuario@ejemplo.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Ingresa tu contraseña"
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/signup" className="underline hover:text-primary">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
