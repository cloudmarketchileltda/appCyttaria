import { addDays, subDays, format } from "date-fns";

export type EstadoCita = "Pendiente" | "Confirmada" | "En progreso" | "Completada" | "Cancelada";

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  visitas: number;
  notas: string;
  alergias: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
  categoria: string;
  activo: boolean;
  icono: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  especialidad: string;
  horario: string;
  servicios: string[];
  comision: number;
  avatar: string;
}

export interface Cita {
  id: string;
  clienteId: string;
  servicioId: string;
  empleadoId: string;
  fecha: string; // ISO
  duracion: number;
  estado: EstadoCita;
  notas?: string;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  precioCompra: number;
  precioVenta: number;
}

export interface Transaccion {
  id: string;
  fecha: string;
  tipo: "Servicio" | "Producto" | "Propina";
  concepto: string;
  empleadoId?: string;
  monto: number;
}

export const categorias = ["Cabello", "Uñas", "Facial", "Maquillaje", "Masajes", "Depilación"];

export const empleados: Empleado[] = [
  { id: "e1", nombre: "María Fernanda López", especialidad: "Estilista Senior — Colorimetría y cortes", horario: "Lun-Vie 9:00-18:00", servicios: ["s1","s2","s3","s4","s5","s6"], comision: 30, avatar: "MF" },
  { id: "e2", nombre: "Carmen Gloria Rivas", especialidad: "Manicurista y Pedicurista", horario: "Lun-Sáb 10:00-19:00", servicios: ["s9","s10","s11","s12"], comision: 25, avatar: "CG" },
  { id: "e3", nombre: "Daniela Paz Muñoz", especialidad: "Maquilladora Profesional", horario: "Mar-Sáb 11:00-20:00", servicios: ["s16","s17","s18"], comision: 35, avatar: "DP" },
  { id: "e4", nombre: "Valentina Solís", especialidad: "Cosmetóloga y Facialista", horario: "Lun-Vie 9:00-17:00", servicios: ["s13","s14","s15","s19","s20"], comision: 30, avatar: "VS" },
  { id: "e5", nombre: "Pilar Andrade", especialidad: "Estilista Junior — Peinados y tratamientos", horario: "Lun-Vie 12:00-19:00", servicios: ["s5","s6","s7","s8"], comision: 20, avatar: "PA" },
];

export const servicios: Servicio[] = [
  { id: "s1", nombre: "Corte dama", descripcion: "Corte y peinado para dama", duracion: 60, precio: 18000, categoria: "Cabello", activo: true, icono: "✂️" },
  { id: "s2", nombre: "Corte varón", descripcion: "Corte clásico o moderno", duracion: 30, precio: 12000, categoria: "Cabello", activo: true, icono: "✂️" },
  { id: "s3", nombre: "Balayage", descripcion: "Iluminación natural del cabello", duracion: 180, precio: 85000, categoria: "Cabello", activo: true, icono: "🎨" },
  { id: "s4", nombre: "Mechas californianas", descripcion: "Mechas degradadas", duracion: 150, precio: 75000, categoria: "Cabello", activo: true, icono: "🌅" },
  { id: "s5", nombre: "Alisado brasileño", descripcion: "Tratamiento alisador", duracion: 180, precio: 65000, categoria: "Cabello", activo: true, icono: "💆‍♀️" },
  { id: "s6", nombre: "Tratamiento de keratina", descripcion: "Hidratación con keratina", duracion: 120, precio: 45000, categoria: "Cabello", activo: true, icono: "✨" },
  { id: "s7", nombre: "Peinado recogido", descripcion: "Peinado para eventos", duracion: 60, precio: 25000, categoria: "Cabello", activo: true, icono: "👰" },
  { id: "s8", nombre: "Peinado novia", descripcion: "Peinado completo para novia", duracion: 90, precio: 55000, categoria: "Cabello", activo: true, icono: "💍" },
  { id: "s9", nombre: "Manicure clásica", descripcion: "Manicure tradicional", duracion: 45, precio: 12000, categoria: "Uñas", activo: true, icono: "💅" },
  { id: "s10", nombre: "Manicure semipermanente", descripcion: "Esmalte de larga duración", duracion: 60, precio: 18000, categoria: "Uñas", activo: true, icono: "💅" },
  { id: "s11", nombre: "Pedicure spa", descripcion: "Pedicure con tratamiento spa", duracion: 75, precio: 22000, categoria: "Uñas", activo: true, icono: "🦶" },
  { id: "s12", nombre: "Nail art decorativo", descripcion: "Diseños personalizados", duracion: 90, precio: 28000, categoria: "Uñas", activo: true, icono: "🎨" },
  { id: "s13", nombre: "Limpieza facial profunda", descripcion: "Limpieza con extracción", duracion: 60, precio: 35000, categoria: "Facial", activo: true, icono: "🧖‍♀️" },
  { id: "s14", nombre: "Hidratación con colágeno", descripcion: "Mascarilla hidratante", duracion: 60, precio: 42000, categoria: "Facial", activo: true, icono: "💧" },
  { id: "s15", nombre: "Peeling químico suave", descripcion: "Renovación celular", duracion: 45, precio: 50000, categoria: "Facial", activo: true, icono: "✨" },
  { id: "s16", nombre: "Maquillaje social", descripcion: "Maquillaje para eventos", duracion: 45, precio: 30000, categoria: "Maquillaje", activo: true, icono: "💄" },
  { id: "s17", nombre: "Maquillaje novia", descripcion: "Maquillaje completo de novia", duracion: 90, precio: 65000, categoria: "Maquillaje", activo: true, icono: "👰" },
  { id: "s18", nombre: "Maquillaje editorial", descripcion: "Maquillaje artístico", duracion: 60, precio: 45000, categoria: "Maquillaje", activo: true, icono: "📸" },
  { id: "s19", nombre: "Masaje relajante", descripcion: "Masaje corporal completo", duracion: 60, precio: 38000, categoria: "Masajes", activo: true, icono: "💆" },
  { id: "s20", nombre: "Depilación facial con hilo", descripcion: "Cejas y rostro", duracion: 30, precio: 10000, categoria: "Depilación", activo: true, icono: "🪡" },
];

const nombresClientes = [
  "Sofía González","Martina Reyes","Catalina Soto","Florencia Díaz","Isidora Martínez",
  "Antonia Castro","Emilia Fuentes","Constanza Paredes","Javiera Torres","Amanda Rojas",
  "Agustina Herrera","Renata Vidal","Luciana Morales","Francisca Silva","Trinidad Campos",
];

export const clientes: Cliente[] = nombresClientes.map((n, i) => ({
  id: `c${i+1}`,
  nombre: n,
  telefono: `+56 9 ${String(1000 + i*137).padStart(4,"0")} ${String(2000 + i*91).padStart(4,"0")}`,
  email: `${n.toLowerCase().replace(/ /g,".").replace(/í/g,"i").replace(/á/g,"a").replace(/é/g,"e").replace(/ó/g,"o").replace(/ú/g,"u")}@email.cl`,
  fechaNacimiento: format(new Date(1985 + (i%15), (i*3)%12, (i*7)%28 + 1), "yyyy-MM-dd"),
  visitas: 2 + (i*3) % 18,
  notas: ["Prefiere cortes clásicos","Alérgica al amoniaco","Cabello muy fino, requiere productos suaves","Le gustan los tonos cálidos","Cliente VIP","Sensible al frío","Prefiere atención por la tarde"][i%7],
  alergias: i%4===0 ? "Amoniaco / sulfatos" : "Ninguna conocida",
}));

const today = new Date();
const horas = [9, 10, 11, 12, 14, 15, 16, 17, 18];
const estados: EstadoCita[] = ["Pendiente","Confirmada","En progreso","Completada","Cancelada"];

export const citas: Cita[] = Array.from({ length: 28 }).map((_, i) => {
  const dayOffset = (i % 6) - 1; // -1..4
  const fecha = new Date(today);
  fecha.setDate(fecha.getDate() + dayOffset);
  fecha.setHours(horas[i % horas.length], (i*15) % 60, 0, 0);
  const servicio = servicios[i % servicios.length];
  let estado: EstadoCita;
  if (dayOffset < 0) estado = i % 5 === 0 ? "Cancelada" : "Completada";
  else if (dayOffset === 0) estado = estados[i % 4];
  else estado = i % 3 === 0 ? "Confirmada" : "Pendiente";
  return {
    id: `a${i+1}`,
    clienteId: clientes[i % clientes.length].id,
    servicioId: servicio.id,
    empleadoId: empleados[i % empleados.length].id,
    fecha: fecha.toISOString(),
    duracion: servicio.duracion,
    estado,
  };
});

export const productos: Producto[] = [
  { id: "p1", nombre: "Shampoo profesional hidratante 500ml", categoria: "Cabello", stock: 18, stockMinimo: 5, precioCompra: 8000, precioVenta: 14500 },
  { id: "p2", nombre: "Acondicionador reparador 500ml", categoria: "Cabello", stock: 22, stockMinimo: 5, precioCompra: 8500, precioVenta: 15000 },
  { id: "p3", nombre: "Mascarilla capilar intensiva", categoria: "Cabello", stock: 2, stockMinimo: 5, precioCompra: 12000, precioVenta: 22000 },
  { id: "p4", nombre: "Aceite de argán 100ml", categoria: "Cabello", stock: 15, stockMinimo: 4, precioCompra: 9000, precioVenta: 17000 },
  { id: "p5", nombre: "Sérum capilar anti-frizz", categoria: "Cabello", stock: 0, stockMinimo: 3, precioCompra: 11000, precioVenta: 19000 },
  { id: "p6", nombre: "Spray protector térmico", categoria: "Cabello", stock: 12, stockMinimo: 4, precioCompra: 7500, precioVenta: 13500 },
  { id: "p7", nombre: "Tinte profesional rubio", categoria: "Color", stock: 8, stockMinimo: 6, precioCompra: 6000, precioVenta: 11000 },
  { id: "p8", nombre: "Tinte profesional castaño", categoria: "Color", stock: 14, stockMinimo: 6, precioCompra: 6000, precioVenta: 11000 },
  { id: "p9", nombre: "Decolorante en polvo 500g", categoria: "Color", stock: 3, stockMinimo: 4, precioCompra: 10000, precioVenta: 18000 },
  { id: "p10", nombre: "Esmalte semipermanente rosa", categoria: "Uñas", stock: 25, stockMinimo: 5, precioCompra: 4500, precioVenta: 8500 },
  { id: "p11", nombre: "Esmalte semipermanente nude", categoria: "Uñas", stock: 30, stockMinimo: 5, precioCompra: 4500, precioVenta: 8500 },
  { id: "p12", nombre: "Top coat brillo extremo", categoria: "Uñas", stock: 1, stockMinimo: 4, precioCompra: 5000, precioVenta: 9500 },
  { id: "p13", nombre: "Removedor de esmalte", categoria: "Uñas", stock: 19, stockMinimo: 5, precioCompra: 3000, precioVenta: 6000 },
  { id: "p14", nombre: "Lima profesional pack 10", categoria: "Uñas", stock: 0, stockMinimo: 3, precioCompra: 5500, precioVenta: 10000 },
  { id: "p15", nombre: "Base de maquillaje líquida", categoria: "Maquillaje", stock: 16, stockMinimo: 5, precioCompra: 12000, precioVenta: 22000 },
  { id: "p16", nombre: "Polvo compacto traslúcido", categoria: "Maquillaje", stock: 11, stockMinimo: 4, precioCompra: 9000, precioVenta: 17000 },
  { id: "p17", nombre: "Labial mate larga duración", categoria: "Maquillaje", stock: 28, stockMinimo: 6, precioCompra: 6500, precioVenta: 12500 },
  { id: "p18", nombre: "Máscara de pestañas voluminizadora", categoria: "Maquillaje", stock: 2, stockMinimo: 5, precioCompra: 7000, precioVenta: 13500 },
  { id: "p19", nombre: "Paleta de sombras 12 tonos", categoria: "Maquillaje", stock: 6, stockMinimo: 3, precioCompra: 14000, precioVenta: 26000 },
  { id: "p20", nombre: "Crema facial hidratante", categoria: "Facial", stock: 20, stockMinimo: 5, precioCompra: 11000, precioVenta: 21000 },
  { id: "p21", nombre: "Sérum vitamina C", categoria: "Facial", stock: 9, stockMinimo: 4, precioCompra: 13000, precioVenta: 24000 },
  { id: "p22", nombre: "Tónico facial purificante", categoria: "Facial", stock: 4, stockMinimo: 5, precioCompra: 8000, precioVenta: 15000 },
  { id: "p23", nombre: "Mascarilla de arcilla", categoria: "Facial", stock: 17, stockMinimo: 4, precioCompra: 6500, precioVenta: 12000 },
  { id: "p24", nombre: "Crema corporal nutritiva", categoria: "Cuerpo", stock: 13, stockMinimo: 4, precioCompra: 9500, precioVenta: 18000 },
  { id: "p25", nombre: "Aceite de masajes relajante", categoria: "Cuerpo", stock: 0, stockMinimo: 3, precioCompra: 10000, precioVenta: 19000 },
];

const tipos: ("Servicio"|"Producto"|"Propina")[] = ["Servicio","Servicio","Servicio","Producto","Propina"];
export const transacciones: Transaccion[] = Array.from({ length: 72 }).map((_, i) => {
  const fecha = subDays(today, i % 30);
  const tipo = tipos[i % tipos.length];
  let concepto = "";
  let monto = 0;
  if (tipo === "Servicio") {
    const s = servicios[i % servicios.length];
    concepto = s.nombre; monto = s.precio;
  } else if (tipo === "Producto") {
    const p = productos[i % productos.length];
    concepto = p.nombre; monto = p.precioVenta;
  } else {
    concepto = "Propina cliente"; monto = 2000 + (i*500) % 8000;
  }
  return {
    id: `t${i+1}`,
    fecha: fecha.toISOString(),
    tipo,
    concepto,
    empleadoId: empleados[i % empleados.length].id,
    monto,
  };
});

export const salonInfo = {
  nombre: "Cyttaria Salón & Spa",
  direccion: "Av. Siempre Viva 742, Santiago, Chile",
  telefono: "+56 9 1234 5678",
  email: "contacto@cyttariasalon.cl",
  horario: "Lunes a Viernes 9:00-19:00 · Sábados 9:00-14:00",
};
