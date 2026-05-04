import { useState, useMemo } from "react";
import { useAppStore, formatCLP } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Servicio } from "@/lib/mockData";

const empty: Omit<Servicio, "id"> = { nombre: "", descripcion: "", duracion: 60, precio: 10000, categoria: "Cabello", activo: true, icono: "✨" };

export default function Servicios() {
  const { servicios, categorias, addServicio, updateServicio, deleteServicio, search } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Servicio | null>(null);
  const [form, setForm] = useState(empty);
  const [filterCat, setFilterCat] = useState<string>("Todas");

  const filtered = useMemo(() => {
    let r = servicios;
    if (filterCat !== "Todas") r = r.filter(s => s.categoria === filterCat);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(s => s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q));
    }
    return r;
  }, [servicios, search, filterCat]);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s: Servicio) => { setEditing(s); setForm(s); setOpen(true); };
  const submit = () => {
    if (!form.nombre.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (editing) { updateServicio(editing.id, form); toast.success("Servicio actualizado"); }
    else { addServicio(form); toast.success("Servicio creado"); }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Catálogo de servicios</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} servicios disponibles</p>
        </div>
        <Button onClick={openNew} className="gradient-primary text-white"><Plus className="w-4 h-4 mr-2" />Nuevo servicio</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["Todas", ...categorias].map(c => (
          <Button key={c} size="sm" variant={filterCat===c?"default":"outline"} onClick={()=>setFilterCat(c)} className={filterCat===c?"gradient-primary text-white":""}>{c}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(s => (
          <Card key={s.id} className="p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div className="text-3xl">{s.icono}</div>
              <Badge variant={s.activo ? "default" : "secondary"} className={s.activo?"gradient-primary text-white":""}>
                {s.activo ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <h3 className="mt-2 font-semibold">{s.nombre}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">{s.descripcion}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{s.duracion} min</span>
              <span className="font-semibold text-accent">{formatCLP(s.precio)}</span>
            </div>
            <Badge variant="outline" className="mt-2">{s.categoria}</Badge>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={()=>openEdit(s)}><Pencil className="w-3 h-3 mr-1" />Editar</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar servicio</AlertDialogTitle>
                    <AlertDialogDescription>¿Estás segura de que deseas eliminar este servicio?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{deleteServicio(s.id); toast.success("Servicio eliminado");}}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar servicio" : "Nuevo servicio"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nombre</Label><Input value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} /></div>
            <div><Label>Descripción</Label><Textarea value={form.descripcion} onChange={(e)=>setForm({...form,descripcion:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Duración (min)</Label><Input type="number" value={form.duracion} onChange={(e)=>setForm({...form,duracion:+e.target.value})} /></div>
              <div><Label>Precio (CLP)</Label><Input type="number" value={form.precio} onChange={(e)=>setForm({...form,precio:+e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoría</Label>
                <Select value={form.categoria} onValueChange={(v)=>setForm({...form,categoria:v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categorias.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Icono</Label><Input value={form.icono} onChange={(e)=>setForm({...form,icono:e.target.value})} maxLength={2} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.activo} onCheckedChange={(v)=>setForm({...form,activo:v})} /><Label>Servicio activo</Label></div>
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
