import { useState, useMemo } from "react";
import { useAppStore, estadoColor } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { addDays, startOfWeek, format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { EstadoCita } from "@/lib/mockData";

const estados: EstadoCita[] = ["Pendiente","Confirmada","En progreso","Completada","Cancelada"];

export default function Agenda() {
  const { citas, clientes, servicios, empleados, addCita, updateCita, deleteCita, search } = useAppStore();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({ clienteId: "", servicioId: "", empleadoId: "", fecha: format(new Date(), "yyyy-MM-dd"), hora: "10:00" });

  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const filtered = useMemo(() => {
    if (!search) return citas;
    const q = search.toLowerCase();
    return citas.filter(c => {
      const cli = clientes.find(x=>x.id===c.clienteId)?.nombre.toLowerCase() ?? "";
      const ser = servicios.find(x=>x.id===c.servicioId)?.nombre.toLowerCase() ?? "";
      return cli.includes(q) || ser.includes(q);
    });
  }, [citas, clientes, servicios, search]);

  const handleCreate = () => {
    if (!form.clienteId || !form.servicioId || !form.empleadoId) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    const s = servicios.find(x=>x.id===form.servicioId)!;
    const fecha = new Date(`${form.fecha}T${form.hora}`);
    const conflict = citas.find(c => c.empleadoId===form.empleadoId && Math.abs(+new Date(c.fecha)-+fecha) < s.duracion*60000 && c.estado!=="Cancelada");
    if (conflict) toast.warning("Conflicto de horario detectado con otra cita");
    addCita({
      clienteId: form.clienteId, servicioId: form.servicioId, empleadoId: form.empleadoId,
      fecha: fecha.toISOString(), duracion: s.duracion, estado: "Pendiente",
    });
    toast.success("Cita creada correctamente");
    setOpenNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground text-sm">Gestiona tus citas de la semana</p>
        </div>
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-white"><Plus className="w-4 h-4 mr-2" />Nueva cita</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva cita</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Cliente</Label>
                <Select value={form.clienteId} onValueChange={(v)=>setForm({...form, clienteId:v})}>
                  <SelectTrigger><SelectValue placeholder="Selecciona cliente" /></SelectTrigger>
                  <SelectContent>{clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Servicio</Label>
                <Select value={form.servicioId} onValueChange={(v)=>setForm({...form, servicioId:v})}>
                  <SelectTrigger><SelectValue placeholder="Selecciona servicio" /></SelectTrigger>
                  <SelectContent>{servicios.map(s => <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estilista</Label>
                <Select value={form.empleadoId} onValueChange={(v)=>setForm({...form, empleadoId:v})}>
                  <SelectTrigger><SelectValue placeholder="Selecciona estilista" /></SelectTrigger>
                  <SelectContent>{empleados.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Fecha</Label><Input type="date" value={form.fecha} onChange={(e)=>setForm({...form, fecha:e.target.value})} /></div>
                <div><Label>Hora</Label><Input type="time" value={form.hora} onChange={(e)=>setForm({...form, hora:e.target.value})} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setOpenNew(false)}>Cancelar</Button>
              <Button onClick={handleCreate} className="gradient-primary text-white">Crear cita</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={()=>setWeekStart(addDays(weekStart,-7))}><ChevronLeft className="w-4 h-4" /></Button>
        <p className="text-sm font-medium px-2">
          Semana del {format(weekStart, "d 'de' MMM", { locale: es })} al {format(addDays(weekStart, 6), "d 'de' MMM yyyy", { locale: es })}
        </p>
        <Button variant="outline" size="icon" onClick={()=>setWeekStart(addDays(weekStart,7))}><ChevronRight className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={()=>setWeekStart(startOfWeek(new Date(), {weekStartsOn:1}))}>Hoy</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-3">
        {days.map(d => {
          const dayCitas = filtered.filter(c => isSameDay(parseISO(c.fecha), d)).sort((a,b)=>+new Date(a.fecha)-+new Date(b.fecha));
          return (
            <Card key={d.toISOString()} className="p-3 min-h-[200px] shadow-soft">
              <div className="mb-2 pb-2 border-b border-border">
                <p className="text-xs uppercase text-muted-foreground">{format(d, "EEEE", { locale: es })}</p>
                <p className="text-lg font-semibold">{format(d, "d MMM", { locale: es })}</p>
              </div>
              <div className="space-y-2">
                {dayCitas.length === 0 && <p className="text-xs text-muted-foreground">Sin citas</p>}
                {dayCitas.map(c => {
                  const cli = clientes.find(x=>x.id===c.clienteId);
                  const s = servicios.find(x=>x.id===c.servicioId);
                  const e = empleados.find(x=>x.id===c.empleadoId);
                  return (
                    <div key={c.id} className="p-2 rounded-md bg-secondary/40 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{format(parseISO(c.fecha), "HH:mm")}</span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar cita</AlertDialogTitle>
                              <AlertDialogDescription>¿Estás segura de que deseas eliminar esta cita? Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={()=>{deleteCita(c.id); toast.success("Cita eliminada");}}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <p className="font-medium truncate">{cli?.nombre}</p>
                      <p className="text-muted-foreground truncate">{s?.nombre}</p>
                      <p className="text-muted-foreground truncate">{e?.nombre.split(" ")[0]}</p>
                      <Select value={c.estado} onValueChange={(v)=>{updateCita(c.id, { estado: v as EstadoCita }); toast.success("Estado actualizado");}}>
                        <SelectTrigger className={`h-7 text-[10px] ${estadoColor(c.estado)}`}><SelectValue /></SelectTrigger>
                        <SelectContent>{estados.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {estados.map(e => <Badge key={e} variant="outline" className={estadoColor(e)}>{e}</Badge>)}
      </div>
    </div>
  );
}
