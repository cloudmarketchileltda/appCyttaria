import { useState, useMemo } from "react";
import { useAppStore, formatCLP } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format, parseISO, subDays, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function Finanzas() {
  const { transacciones, empleados } = useAppStore();
  const [from, setFrom] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [tipo, setTipo] = useState<string>("Todos");
  const [empId, setEmpId] = useState<string>("Todos");

  const filtered = useMemo(() => {
    return transacciones.filter(t => {
      const d = parseISO(t.fecha);
      if (isBefore(d, parseISO(from))) return false;
      if (isAfter(d, parseISO(to + "T23:59:59"))) return false;
      if (tipo !== "Todos" && t.tipo !== tipo) return false;
      if (empId !== "Todos" && t.empleadoId !== empId) return false;
      return true;
    });
  }, [transacciones, from, to, tipo, empId]);

  const brutos = filtered.reduce((s,t)=>s+t.monto,0);
  const propinas = filtered.filter(t=>t.tipo==="Propina").reduce((s,t)=>s+t.monto,0);
  const comisiones = filtered.filter(t=>t.tipo==="Servicio").reduce((s,t)=>{
    const e = empleados.find(x=>x.id===t.empleadoId);
    return s + (t.monto * (e?.comision ?? 0) / 100);
  },0);
  const netos = brutos - comisiones;

  const dataChart = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(t => {
      const k = format(parseISO(t.fecha), "dd/MM");
      map.set(k, (map.get(k) ?? 0) + t.monto);
    });
    return Array.from(map.entries()).map(([fecha, monto]) => ({ fecha, monto })).reverse();
  }, [filtered]);

  const exportar = () => {
    const headers = ["Fecha","Tipo","Concepto","Empleado","Monto"];
    const rows = filtered.map(t => [
      format(parseISO(t.fecha),"yyyy-MM-dd HH:mm"), t.tipo, t.concepto,
      empleados.find(e=>e.id===t.empleadoId)?.nombre ?? "—", t.monto
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reporte_finanzas.csv"; a.click();
    toast.success("Reporte exportado");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Finanzas</h1>
        <p className="text-muted-foreground text-sm">Control de ingresos, comisiones y propinas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Ingresos brutos", v: formatCLP(brutos) },
          { l: "Comisiones", v: formatCLP(comisiones) },
          { l: "Propinas", v: formatCLP(propinas) },
          { l: "Ingresos netos", v: formatCLP(netos) },
        ].map(c => (
          <Card key={c.l} className="shadow-soft"><CardContent className="p-4">
            <p className="text-xs uppercase text-muted-foreground">{c.l}</p>
            <p className="mt-2 text-lg sm:text-xl font-semibold">{c.v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div><Label>Desde</Label><Input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} /></div>
          <div><Label>Hasta</Label><Input type="date" value={to} onChange={(e)=>setTo(e.target.value)} /></div>
          <div><Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Todos","Servicio","Producto","Propina"].map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Empleado</Label>
            <Select value={empId} onValueChange={setEmpId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {empleados.map(e=><SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end"><Button onClick={exportar} variant="outline" className="w-full"><Download className="w-4 h-4 mr-2" />Exportar CSV</Button></div>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle>Evolución de ingresos</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="fecha" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v:number)=>formatCLP(v)} contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:8}} />
              <Line type="monotone" dataKey="monto" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill:"hsl(var(--accent))" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle>Transacciones ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead className="hidden md:table-cell">Empleado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.slice(0, 50).map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="text-xs whitespace-nowrap">{format(parseISO(t.fecha),"d MMM yyyy",{locale:es})}</TableCell>
                    <TableCell className="text-xs">{t.tipo}</TableCell>
                    <TableCell className="text-xs">{t.concepto}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{empleados.find(e=>e.id===t.empleadoId)?.nombre ?? "—"}</TableCell>
                    <TableCell className="text-right font-medium">{formatCLP(t.monto)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
