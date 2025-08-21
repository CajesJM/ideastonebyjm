import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IdeaGenerator from './Components/IdeaGenerator.jsx';
import HomePage from './HomePage.jsx';
function App() {
  return (
    <>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Generator" element={<IdeaGenerator />} />
      </Routes>
    </BrowserRouter>

      
    </>
  );
}

export default App;