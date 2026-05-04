import { useState, useMemo } from "react";
import { useAppStore, formatCLP } from "@/store/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { Producto } from "@/lib/mockData";

const empty: Omit<Producto,"id"> = { nombre: "", categoria: "Cabello", stock: 0, stockMinimo: 5, precioCompra: 0, precioVenta: 0 };

export default function Inventario() {
  const { productos, addProducto, updateProducto, deleteProducto, search } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Producto|null>(null);
  const [form, setForm] = useState(empty);

  const filtered = useMemo(() => productos.filter(p =>
    !search || p.nombre.toLowerCase().includes(search.toLowerCase())
  ), [productos, search]);

  const stockBajo = productos.filter(p => p.stock <= p.stockMinimo);

  const submit = () => {
    if (!form.nombre.trim()) { toast.error("Nombre obligatorio"); return; }
    if (editing) { updateProducto(editing.id, form); toast.success("Producto actualizado"); }
    else { addProducto(form); toast.success("Producto creado"); }
    setOpen(false);
  };

  const venderProducto = (p: Producto) => {
    if (p.stock <= 0) { toast.error("Sin stock disponible"); return; }
    updateProducto(p.id, { stock: p.stock - 1 });
    toast.success(`Venta registrada: ${p.nombre}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} productos · {stockBajo.length} con stock bajo</p>
        </div>
        <Button onClick={()=>{setEditing(null);setForm(empty);setOpen(true);}} className="gradient-primary text-white"><Plus className="w-4 h-4 mr-2" />Nuevo producto</Button>
      </div>

      {stockBajo.length > 0 && (
        <Card className="border-warning/50 bg-warning/5 shadow-soft">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Productos con stock bajo o agotados</p>
              <p className="text-xs text-muted-foreground">{stockBajo.map(p=>p.nombre).slice(0,3).join(", ")}{stockBajo.length>3?` y ${stockBajo.length-3} más`:""}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
        {filtered.map(p => (
          <Card key={p.id} className="p-3 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm">{p.nombre}</p>
              <Badge variant={p.stock===0?"destructive":p.stock<=p.stockMinimo?"outline":"secondary"} className={p.stock<=p.stockMinimo&&p.stock>0?"border-warning text-warning":""}>{p.stock} u.</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{p.categoria}</p>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-muted-foreground">Compra: {formatCLP(p.precioCompra)}</span>
              <span className="font-semibold">{formatCLP(p.precioVenta)}</span>
            </div>
            <div className="flex gap-1 mt-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={()=>venderProducto(p)}>Vender</Button>
              <Button size="sm" variant="ghost" onClick={()=>{setEditing(p);setForm(p);setOpen(true);}}><Pencil className="w-3 h-3" /></Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden lg:block shadow-soft">
        <CardContent className="p-0 overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Compra</TableHead>
              <TableHead className="text-right">Venta</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={p.stock===0?"destructive":"outline"} className={p.stock<=p.stockMinimo&&p.stock>0?"border-warning text-warning":""}>{p.stock} u.</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCLP(p.precioCompra)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCLP(p.precioVenta)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={()=>venderProducto(p)}>Vender</Button>
                      <Button size="sm" variant="ghost" onClick={()=>{setEditing(p);setForm(p);setOpen(true);}}><Pencil className="w-3 h-3" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="sm" variant="ghost"><Trash2 className="w-3 h-3" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                            <AlertDialogDescription>¿Estás segura de que deseas eliminar este producto?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>{deleteProducto(p.id); toast.success("Producto eliminado");}}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?"Editar producto":"Nuevo producto"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nombre</Label><Input value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} /></div>
            <div><Label>Categoría</Label><Input value={form.categoria} onChange={(e)=>setForm({...form,categoria:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e)=>setForm({...form,stock:+e.target.value})} /></div>
              <div><Label>Stock mínimo</Label><Input type="number" value={form.stockMinimo} onChange={(e)=>setForm({...form,stockMinimo:+e.target.value})} /></div>
              <div><Label>Precio compra</Label><Input type="number" value={form.precioCompra} onChange={(e)=>setForm({...form,precioCompra:+e.target.value})} /></div>
              <div><Label>Precio venta</Label><Input type="number" value={form.precioVenta} onChange={(e)=>setForm({...form,precioVenta:+e.target.value})} /></div>
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
