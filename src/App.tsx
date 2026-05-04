import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Clientes from "./pages/Clientes";
import Servicios from "./pages/Servicios";
import Empleados from "./pages/Empleados";
import Finanzas from "./pages/Finanzas";
import Inventario from "./pages/Inventario";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/agenda" element={<AppLayout><Agenda /></AppLayout>} />
          <Route path="/clientes" element={<AppLayout><Clientes /></AppLayout>} />
          <Route path="/servicios" element={<AppLayout><Servicios /></AppLayout>} />
          <Route path="/empleados" element={<AppLayout><Empleados /></AppLayout>} />
          <Route path="/finanzas" element={<AppLayout><Finanzas /></AppLayout>} />
          <Route path="/inventario" element={<AppLayout><Inventario /></AppLayout>} />
          <Route path="/configuracion" element={<AppLayout><Configuracion /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
