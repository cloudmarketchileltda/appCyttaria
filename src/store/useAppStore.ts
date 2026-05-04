import { create } from "zustand";
import {
  clientes as clientesMock, servicios as serviciosMock, empleados as empleadosMock,
  citas as citasMock, productos as productosMock, transacciones as transaccionesMock,
  categorias as categoriasMock, salonInfo as salonInfoMock,
  type Cliente, type Servicio, type Empleado, type Cita, type Producto, type Transaccion,
} from "@/lib/mockData";

interface State {
  clientes: Cliente[];
  servicios: Servicio[];
  empleados: Empleado[];
  citas: Cita[];
  productos: Producto[];
  transacciones: Transaccion[];
  categorias: string[];
  salonInfo: typeof salonInfoMock;
  theme: "light" | "dark";
  search: string;

  setSearch: (q: string) => void;
  toggleTheme: () => void;
  setSalonInfo: (i: Partial<typeof salonInfoMock>) => void;

  addCliente: (c: Omit<Cliente, "id">) => void;
  updateCliente: (id: string, c: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;

  addServicio: (s: Omit<Servicio, "id">) => void;
  updateServicio: (id: string, s: Partial<Servicio>) => void;
  deleteServicio: (id: string) => void;

  addCita: (c: Omit<Cita, "id">) => void;
  updateCita: (id: string, c: Partial<Cita>) => void;
  deleteCita: (id: string) => void;

  addProducto: (p: Omit<Producto, "id">) => void;
  updateProducto: (id: string, p: Partial<Producto>) => void;
  deleteProducto: (id: string) => void;

  addEmpleado: (e: Omit<Empleado, "id">) => void;
  updateEmpleado: (id: string, e: Partial<Empleado>) => void;
  deleteEmpleado: (id: string) => void;

  addCategoria: (c: string) => void;
  deleteCategoria: (c: string) => void;
}

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export const useAppStore = create<State>((set) => ({
  clientes: clientesMock,
  servicios: serviciosMock,
  empleados: empleadosMock,
  citas: citasMock,
  productos: productosMock,
  transacciones: transaccionesMock,
  categorias: categoriasMock,
  salonInfo: salonInfoMock,
  theme: "light",
  search: "",

  setSearch: (q) => set({ search: q }),
  toggleTheme: () => set((s) => {
    const next = s.theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    return { theme: next };
  }),
  setSalonInfo: (i) => set((s) => ({ salonInfo: { ...s.salonInfo, ...i } })),

  addCliente: (c) => set((s) => ({ clientes: [{ ...c, id: uid("c") }, ...s.clientes] })),
  updateCliente: (id, c) => set((s) => ({ clientes: s.clientes.map(x => x.id===id ? {...x,...c} : x) })),
  deleteCliente: (id) => set((s) => ({ clientes: s.clientes.filter(x => x.id!==id) })),

  addServicio: (s2) => set((s) => ({ servicios: [{ ...s2, id: uid("s") }, ...s.servicios] })),
  updateServicio: (id, s2) => set((s) => ({ servicios: s.servicios.map(x => x.id===id ? {...x,...s2} : x) })),
  deleteServicio: (id) => set((s) => ({ servicios: s.servicios.filter(x => x.id!==id) })),

  addCita: (c) => set((s) => ({ citas: [{ ...c, id: uid("a") }, ...s.citas] })),
  updateCita: (id, c) => set((s) => ({ citas: s.citas.map(x => x.id===id ? {...x,...c} : x) })),
  deleteCita: (id) => set((s) => ({ citas: s.citas.filter(x => x.id!==id) })),

  addProducto: (p) => set((s) => ({ productos: [{ ...p, id: uid("p") }, ...s.productos] })),
  updateProducto: (id, p) => set((s) => ({ productos: s.productos.map(x => x.id===id ? {...x,...p} : x) })),
  deleteProducto: (id) => set((s) => ({ productos: s.productos.filter(x => x.id!==id) })),

  addEmpleado: (e) => set((s) => ({ empleados: [{ ...e, id: uid("e") }, ...s.empleados] })),
  updateEmpleado: (id, e) => set((s) => ({ empleados: s.empleados.map(x => x.id===id ? {...x,...e} : x) })),
  deleteEmpleado: (id) => set((s) => ({ empleados: s.empleados.filter(x => x.id!==id) })),

  addCategoria: (c) => set((s) => s.categorias.includes(c) ? s : ({ categorias: [...s.categorias, c] })),
  deleteCategoria: (c) => set((s) => ({ categorias: s.categorias.filter(x => x !== c) })),
}));

export const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const estadoColor = (e: string) => {
  switch (e) {
    case "Pendiente": return "bg-warning/20 text-warning-foreground border-warning/40";
    case "Confirmada": return "bg-info/20 text-foreground border-info/40";
    case "En progreso": return "bg-primary/20 text-primary-foreground border-primary/40";
    case "Completada": return "bg-success/20 text-foreground border-success/40";
    case "Cancelada": return "bg-destructive/15 text-destructive border-destructive/40";
    default: return "bg-muted text-muted-foreground";
  }
};
