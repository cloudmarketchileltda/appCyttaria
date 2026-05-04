import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function Configuracion() {
  const { salonInfo, setSalonInfo, categorias, addCategoria, deleteCategoria } = useAppStore();
  const [info, setInfo] = useState(salonInfo);
  const [nuevaCat, setNuevaCat] = useState("");

  const guardar = () => { setSalonInfo(info); toast.success("Configuración guardada"); };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground text-sm">Datos del salón y preferencias generales</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader><CardTitle>Información del salón</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Nombre</Label><Input value={info.nombre} onChange={(e)=>setInfo({...info, nombre: e.target.value})} /></div>
          <div><Label>Dirección</Label><Input value={info.direccion} onChange={(e)=>setInfo({...info, direccion: e.target.value})} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label>Teléfono</Label><Input value={info.telefono} onChange={(e)=>setInfo({...info, telefono: e.target.value})} /></div>
            <div><Label>Email</Label><Input value={info.email} onChange={(e)=>setInfo({...info, email: e.target.value})} /></div>
          </div>
          <div><Label>Horario de atención</Label><Input value={info.horario} onChange={(e)=>setInfo({...info, horario: e.target.value})} /></div>
          <Button onClick={guardar} className="gradient-primary text-white">Guardar cambios</Button>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle>Categorías de servicios</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categorias.map(c => (
              <Badge key={c} variant="outline" className="gap-2 py-1.5 px-3">
                {c}
                <button onClick={()=>{deleteCategoria(c); toast.success("Categoría eliminada");}}><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={nuevaCat} onChange={(e)=>setNuevaCat(e.target.value)} placeholder="Nueva categoría" />
            <Button onClick={()=>{ if(nuevaCat.trim()){addCategoria(nuevaCat.trim()); setNuevaCat(""); toast.success("Categoría agregada");} }}><Plus className="w-4 h-4 mr-1" />Agregar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
