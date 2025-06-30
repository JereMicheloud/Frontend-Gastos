"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarMenu, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { APP_ICON, APP_NAME, navItems } from "@/config/nav";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Menu, UserCircle, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground p-0">
            <nav className="grid gap-6 text-lg font-medium p-4">
              <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                onClick={() => setOpenMobile(false)}
              >
                <APP_ICON className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">{APP_NAME}</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-2.5 hover:text-sidebar-accent-foreground",
                    pathname === item.href ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
                  )}
                  onClick={() => setOpenMobile(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
               <button
                  onClick={() => { logout(); setOpenMobile(false); }}
                  className="flex items-center gap-4 px-2.5 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </button>
            </nav>
          </SheetContent>
        </Sheet>
      )}
      
      {!isMobile && <SidebarTrigger className="hidden md:flex" />}

      <div className="flex-1">
        {/* Breadcrumbs or Page Title can go here */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <UserCircle className="h-6 w-6" />
             <span className="sr-only">Alternar menú de usuario</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.display_name || user?.email || "Mi Cuenta"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer flex items-center gap-2">
              <Settings className="h-4 w-4" /> Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
