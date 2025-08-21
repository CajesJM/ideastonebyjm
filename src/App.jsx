import { HashRouter, Routes, Route } from 'react-router-dom';
import IdeaGenerator from './Components/IdeaGenerator.jsx';
import HomePage from './HomePage.jsx';
function App() {
  return (
    <>
  <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Generator" element={<IdeaGenerator />} />
      </Routes>
    </HashRouter>

      
    </>
  );
}

export default App;