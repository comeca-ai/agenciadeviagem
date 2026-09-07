import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import Destinos from "./pages/Destinos";
import ALenda from "./pages/ALenda";
import ComoFunciona from "./pages/ComoFunciona";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="resultados" element={<Resultados />} />
        <Route path="destinos" element={<Destinos />} />
        <Route path="a-lenda" element={<ALenda />} />
        <Route path="como-funciona" element={<ComoFunciona />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
