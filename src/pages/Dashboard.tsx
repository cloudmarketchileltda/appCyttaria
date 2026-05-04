import { useAppStore, formatCLP, estadoColor } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Sparkles } from "lucide-react";
import { format, isToday, isThisMonth, startOfWeek, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { citas, transacciones, clientes, servicios, empleados } = useAppStore();

  const citasHoy = citas.filter(c => isToday(new Date(c.fecha)));
  const ingresosMes = transacciones.filter(t => isThisMonth(new Date(t.fecha))).reduce((s,t) => s+t.monto, 0);
  const clientesNuevos = clientes.slice(0, 6).length;

  const popular = servicios.map(s => ({
    s, count: citas.filter(c => c.servicioId === s.id).length
  })).sort((a,b) => b.count-a.count).slice(0, 1)[0];

  const startWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const dataSemana = Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(startWeek, i);
    const total = transacciones.filter(t => isSameDay(new Date(t.fecha), d)).reduce((s,t)=>s+t.monto,0);
    return { dia: format(d, "EEE", { locale: es }), ingresos: total };
  });

  const cards = [
    { label: "Citas de hoy", value: citasHoy.length, icon: Calendar, hint: `${citasHoy.filter(c=>c.estado!=="Cancelada").length} activas` },
    { label: "Ingresos del mes", value: formatCLP(ingresosMes), icon: TrendingUp, hint: "Mes en curso" },
    { label: "Clientes nuevos", value: clientesNuevos, icon: Users, hint: "Últimos 30 días" },
    { label: "Servicio popular", value: popular?.s.nombre ?? "—", icon: Sparkles, hint: `${popular?.count ?? 0} reservas` },
  ];

  const proximas = citas
    .filter(c => isToday(new Date(c.fecha)) && c.estado !== "Cancelada" && c.estado !== "Completada")
    .sort((a,b) => +new Date(a.fecha) - +new Date(b.fecha))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Bienvenida</h1>
        <p className="text-muted-foreground">Resumen general de Cyttaria Salón · {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label} className="shadow-soft border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-2 text-xl sm:text-2xl font-semibold truncate">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.hint}</p>
                </div>
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0">
                  <c.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader><CardTitle>Ingresos de la semana</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v)=> `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => formatCLP(v)}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Bar dataKey="ingresos" fill="hsl(var(--primary))" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Próximas citas de hoy</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {proximas.length === 0 && <p className="text-sm text-muted-foreground">No hay citas pendientes.</p>}
            {proximas.map(c => {
              const cli = clientes.find(x => x.id === c.clienteId);
              const s = servicios.find(x => x.id === c.servicioId);
              const e = empleados.find(x => x.id === c.empleadoId);
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                  <div className="text-center min-w-[44px]">
                    <p className="text-sm font-semibold">{format(new Date(c.fecha), "HH:mm")}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cli?.nombre}</p>
                    <p className="text-xs text-muted-foreground truncate">{s?.nombre} · {e?.nombre.split(" ")[0]}</p>
                  </div>
                  <Badge variant="outline" className={estadoColor(c.estado)}>{c.estado}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
