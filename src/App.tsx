import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Resultados = lazy(() => import("./pages/Resultados"));
const Destinos = lazy(() => import("./pages/Destinos"));
const ALenda = lazy(() => import("./pages/ALenda"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const Entrar = lazy(() => import("./pages/Entrar"));
const Alertas = lazy(() => import("./pages/Alertas"));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground" aria-busy="true">
      Carregando…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="destinos" element={<Destinos />} />
          <Route path="a-lenda" element={<ALenda />} />
          <Route path="como-funciona" element={<ComoFunciona />} />
          <Route path="entrar" element={<Entrar />} />
          <Route path="conta/alertas" element={<Alertas />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
