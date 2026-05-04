import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, Scissors, UserCog, Wallet, Package, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Inicio", icon: LayoutDashboard },
  { to: "/agenda", label: "Agenda", icon: Calendar },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/servicios", label: "Servicios", icon: Scissors },
  { to: "/empleados", label: "Empleados", icon: UserCog },
  { to: "/finanzas", label: "Finanzas", icon: Wallet },
  { to: "/inventario", label: "Inventario", icon: Package },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight" style={{ fontFamily: "Playfair Display" }}>Cyttaria</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Salón & Spa</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                title={it.label}
              >
                <it.icon className="w-4 h-4 shrink-0" />
                <span>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>v1.0 · Maqueta demo</p>
        </div>
      </aside>
    </>
  );
}
