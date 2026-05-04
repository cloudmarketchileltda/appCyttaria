import { Menu, Search, Moon, Sun, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { differenceInDays, parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { search, setSearch, theme, toggleTheme, productos, clientes, citas } = useAppStore();

  const stockBajo = productos.filter(p => p.stock <= p.stockMinimo);
  const today = new Date();
  const cumples = clientes.filter(c => {
    const b = parseISO(c.fechaNacimiento);
    const t = new Date(today.getFullYear(), b.getMonth(), b.getDate());
    return differenceInDays(t, today) >= 0 && differenceInDays(t, today) <= 7;
  });
  const proximas = citas.filter(c => {
    const f = new Date(c.fecha);
    return f >= today && (c.estado === "Pendiente" || c.estado === "Confirmada");
  }).slice(0, 5);

  const totalNotif = stockBajo.length + cumples.length + proximas.length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Abrir menú">
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar clientes, servicios, productos..."
          className="pl-9 bg-secondary/50 border-secondary"
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
            <Bell className="w-5 h-5" />
            {totalNotif > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">{totalNotif}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="p-3 border-b border-border">
            <p className="font-semibold text-sm">Notificaciones</p>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-border text-sm">
            {proximas.map(c => (
              <div key={c.id} className="p-3">
                <p className="font-medium">Próxima cita</p>
                <p className="text-muted-foreground text-xs">{format(new Date(c.fecha), "PPp", { locale: es })}</p>
              </div>
            ))}
            {stockBajo.slice(0, 5).map(p => (
              <div key={p.id} className="p-3">
                <p className="font-medium">Stock bajo: {p.nombre}</p>
                <p className="text-muted-foreground text-xs">{p.stock} unidades disponibles</p>
              </div>
            ))}
            {cumples.map(c => (
              <div key={c.id} className="p-3">
                <p className="font-medium">🎂 Cumpleaños cercano</p>
                <p className="text-muted-foreground text-xs">{c.nombre} — {format(parseISO(c.fechaNacimiento), "d 'de' MMMM", { locale: es })}</p>
              </div>
            ))}
            {totalNotif === 0 && <div className="p-6 text-center text-muted-foreground">Sin notificaciones</div>}
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Cambiar tema">
        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </Button>
      <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">A</div>
        <div className="hidden md:block">
          <p className="text-sm font-medium leading-tight">Administradora</p>
          <p className="text-xs text-muted-foreground leading-tight">Cyttaria Salón</p>
        </div>
      </div>
    </header>
  );
}
