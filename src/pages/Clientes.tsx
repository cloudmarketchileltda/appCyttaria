import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Calendar, Phone, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Cliente } from "@/lib/mockData";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const empty: Omit<Cliente, "id"> = { nombre: "", telefono: "", email: "", fechaNacimiento: "", visitas: 0, notas: "", alergias: "" };

export default function Clientes() {
  const { clientes, addCliente, updateCliente, deleteCliente, search } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const filtered = useMemo(() => {
    if (!search) return clientes;
    const q = search.toLowerCase();
    return clientes.filter(c => c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.telefono.includes(q));
  }, [clientes, search]);

  const openNew = () => { setEditing(null); setForm(empty); setErrors({}); setOpen(true); };
  const openEdit = (c: Cliente) => { setEditing(c); setForm(c); setErrors({}); setOpen(true); };

  const submit = () => {
    const errs: Record<string,string> = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.telefono.trim()) errs.telefono = "El teléfono es obligatorio";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Email inválido";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editing) { updateCliente(editing.id, form); toast.success("Cliente actualizado"); }
    else { addCliente(form); toast.success("Cliente creado"); }
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} clientes registrados</p>
        </div>
        <Button onClick={openNew} className="gradient-primary text-white"><Plus className="w-4 h-4 mr-2" />Nuevo cliente</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <Card key={c.id} className="p-4 shadow-soft hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center font-semibold shrink-0">
                {c.nombre.split(" ").map(n=>n[0]).slice(0,2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.nombre}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate"><Phone className="w-3 h-3" />{c.telefono}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate"><Mail className="w-3 h-3" />{c.email}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-secondary/50 rounded p-2"><p className="text-muted-foreground">Visitas</p><p className="font-semibold">{c.visitas}</p></div>
              <div className="bg-secondary/50 rounded p-2"><p className="text-muted-foreground">Cumple</p><p className="font-semibold">{c.fechaNacimiento ? format(parseISO(c.fechaNacimiento), "d MMM", { locale: es }) : "—"}</p></div>
            </div>
            {c.notas && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">📝 {c.notas}</p>}
            {c.alergias && c.alergias !== "Ninguna conocida" && <p className="text-xs text-destructive mt-1">⚠ {c.alergias}</p>}
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1"><Calendar className="w-3 h-3 mr-1" />Agendar</Button>
              <Button size="sm" variant="ghost" onClick={()=>openEdit(c)}><Pencil className="w-3 h-3" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
                    <AlertDialogDescription>¿Estás segura de que deseas eliminar a {c.nombre}? Esta acción no se puede deshacer.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{deleteCliente(c.id); toast.success("Cliente eliminado");}}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nombre completo</Label>
              <Input value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} placeholder="Ej. Sofía González" />
              {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Teléfono</Label>
                <Input value={form.telefono} onChange={(e)=>setForm({...form,telefono:e.target.value})} placeholder="+56 9 ..." />
                {errors.telefono && <p className="text-xs text-destructive mt-1">{errors.telefono}</p>}
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="cliente@email.cl" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>
            <div>
              <Label>Fecha de nacimiento</Label>
              <Input type="date" value={form.fechaNacimiento} onChange={(e)=>setForm({...form,fechaNacimiento:e.target.value})} />
            </div>
            <div>
              <Label>Notas / preferencias</Label>
              <Textarea value={form.notas} onChange={(e)=>setForm({...form,notas:e.target.value})} placeholder="Preferencias del cliente" />
            </div>
            <div>
              <Label>Alergias / condiciones especiales</Label>
              <Input value={form.alergias} onChange={(e)=>setForm({...form,alergias:e.target.value})} placeholder="Ninguna conocida" />
            </div>
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
