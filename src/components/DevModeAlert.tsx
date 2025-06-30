"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { DevFallbackService } from "@/lib/dev-fallback";
import { useEffect, useState } from "react";

export function DevModeAlert() {
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Verificar si el modo dev está habilitado
    setIsDevMode(DevFallbackService.isEnabled());
    
    // Verificar cada 5 segundos (por si se habilita durante el uso)
    const interval = setInterval(() => {
      setIsDevMode(DevFallbackService.isEnabled());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isDevMode) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <div className="flex items-center gap-2">
        <span className="text-orange-500">🔧</span>
        <AlertDescription className="text-orange-800">
          <strong>Modo Desarrollo:</strong> Backend no disponible. 
          Para probar login usa: <code className="text-xs bg-orange-100 px-1 rounded">test@test.com</code> / <code className="text-xs bg-orange-100 px-1 rounded">test123</code>
        </AlertDescription>
      </div>
    </Alert>
  );
}
