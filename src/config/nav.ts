import type { NavItem } from '@/types';
import { LayoutDashboard, ListChecks, BarChart3, Settings, Landmark } from 'lucide-react';

export const APP_NAME = "FinTrack";
export const APP_ICON = Landmark;

export const navItems: NavItem[] = [
  {
    title: 'Panel de Control',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Resumen de tus finanzas.',
  },
  {
    title: 'Transacciones',
    href: '/transactions',
    icon: ListChecks,
    description: 'Ver y gestionar tus transacciones.',
  },
  {
    title: 'Análisis',
    href: '/analytics',
    icon: BarChart3,
    description: 'Visualiza tus hábitos de gasto.',
  },
  {
    title: 'Configuración',
    href: '/settings',
    icon: Settings,
    description: 'Gestiona la configuración de tu aplicación.',
  },
];
