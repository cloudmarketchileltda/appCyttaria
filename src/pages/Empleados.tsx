import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Empleado } from "@/lib/mockData";
import { format, parseISO, isToday, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

const empty: Omit<Empleado,"id"> = { nombre: "", especialidad: "", horario: "", servicios: [], comision: 25, avatar: "" };

export default function Empleados() {
  const { empleados, citas, clientes, servicios, addEmpleado, updateEmpleado, deleteEmpleado, search } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Empleado|null>(null);
  const [form, setForm] = useState(empty);

  const filtered = empleados.filter(e => !search || e.nombre.toLowerCase().includes(search.toLowerCase()));

  const submit = () => {
    if (!form.nombre.trim()) { toast.error("Nombre obligatorio"); return; }
    const av = form.avatar || form.nombre.split(" ").map(n=>n[0]).slice(0,2).join("");
    if (editing) { updateEmpleado(editing.id, {...form, avatar: av}); toast.success("Empleado actualizado"); }
    else { addEmpleado({...form, avatar: av}); toast.success("Empleado creado"); }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Empleados</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} miembros del equipo</p>
        </div>
        <Button onClick={()=>{setEditing(null);setForm(empty);setOpen(true);}} className="gradient-primary text-white"><Plus className="w-4 h-4 mr-2" />Nuevo empleado</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(e => {
          const sus = citas.filter(c => c.empleadoId === e.id);
          const hoy = sus.filter(c => isToday(parseISO(c.fecha)));
          return (
            <Card key={e.id} className="p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full gradient-primary text-white flex items-center justify-center font-semibold text-lg shrink-0">{e.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{e.nombre}</p>
                  <p className="text-xs text-muted-foreground">{e.especialidad}</p>
                  <p className="text-xs text-muted-foreground mt-1">📅 {e.horario}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-secondary/50 rounded p-2"><p className="text-[10px] uppercase text-muted-foreground">Comisión</p><p className="text-sm font-semibold">{e.comision}%</p></div>
                <div className="bg-secondary/50 rounded p-2"><p className="text-[10px] uppercase text-muted-foreground">Hoy</p><p className="text-sm font-semibold">{hoy.length}</p></div>
                <div className="bg-secondary/50 rounded p-2"><p className="text-[10px] uppercase text-muted-foreground">Total</p><p className="text-sm font-semibold">{sus.length}</p></div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Disponibilidad próximos 5 días</p>
                <div className="flex gap-1">
                  {Array.from({length:5}).map((_,i)=>{
                    const d = addDays(new Date(),i);
                    const occ = sus.filter(c=>isSameDay(parseISO(c.fecha),d) && c.estado!=="Cancelada").length;
                    return (
                      <div key={i} className="flex-1 text-center">
                        <p className="text-[10px] text-muted-foreground">{format(d,"EEE",{locale:es})}</p>
                        <div className={`mt-1 h-6 rounded text-[10px] flex items-center justify-center ${occ>=3?"bg-destructive/30":occ>0?"bg-warning/30":"bg-success/20"}`}>{occ}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {hoy.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium">Citas de hoy:</p>
                  {hoy.slice(0,3).map(c => {
                    const cli = clientes.find(x=>x.id===c.clienteId);
                    const s = servicios.find(x=>x.id===c.servicioId);
                    return <p key={c.id} className="text-xs text-muted-foreground truncate">{format(parseISO(c.fecha),"HH:mm")} · {cli?.nombre} ({s?.nombre})</p>;
                  })}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={()=>{setEditing(e);setForm(e);setOpen(true);}}><Pencil className="w-3 h-3 mr-1" />Editar</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminar empleado</AlertDialogTitle>
                      <AlertDialogDescription>¿Estás segura de que deseas eliminar a {e.nombre}?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={()=>{deleteEmpleado(e.id); toast.success("Empleado eliminado");}}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?"Editar empleado":"Nuevo empleado"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nombre</Label><Input value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} /></div>
            <div><Label>Especialidad</Label><Input value={form.especialidad} onChange={(e)=>setForm({...form,especialidad:e.target.value})} /></div>
            <div><Label>Horario</Label><Input value={form.horario} onChange={(e)=>setForm({...form,horario:e.target.value})} placeholder="Lun-Vie 9:00-18:00" /></div>
            <div><Label>Comisión (%)</Label><Input type="number" value={form.comision} onChange={(e)=>setForm({...form,comision:+e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancelar</Button>
            <Button onClick={submit} className="gradient-primary text-white">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
