import { Routes, Route } from 'react-router-dom'
import Home               from './pages/Home'
import Departamentos       from './pages/Departamentos'
import LinhaSP2            from './pages/LinhaSP2'
import Linha1              from './pages/Linha1'
import PC                  from './pages/PC'
import ProcedimentosSeguranca from './pages/ProcedimentosSeguranca'
import DialogoDiarioSeguranca from './pages/DialogoDiarioSeguranca'

export default function App() {
  return (
    <Routes>
      <Route path="/"                          element={<Home />} />
      <Route path="/departamentos"             element={<Departamentos />} />
      <Route path="/fabrica2"                  element={<LinhaSP2 />} />
      <Route path="/fabrica2/linha1"           element={<Linha1 />} />
      <Route path="/fabrica2/linha1/pc"        element={<PC />} />
      <Route path="/procedimentos-seguranca"   element={<ProcedimentosSeguranca />} />
      <Route path="/dds"                       element={<DialogoDiarioSeguranca />} />
    </Routes>
  )
}
