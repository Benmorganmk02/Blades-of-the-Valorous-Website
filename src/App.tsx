import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Lore from './pages/Lore';
import LoreWorld from './pages/LoreWorld';
import LoreChapter from './pages/LoreChapter';
import CharacterSheets from './pages/CharacterSheets';
import Builder from './pages/Builder';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="rules" element={<Rules />} />
        <Route path="lore" element={<Lore />} />
        <Route path="lore/:world" element={<LoreWorld />} />
        <Route path="lore/:world/:chapter" element={<LoreChapter />} />
        <Route path="character-sheets" element={<CharacterSheets />} />
        <Route path="builder" element={<Builder />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
