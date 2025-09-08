import { HashRouter, Routes, Route } from 'react-router-dom';
import IdeaGenerator from './Components/IdeaGenerator.jsx';
import HomePage from './HomePage.jsx';
import Loader from './Components/Loader.jsx'
import {useState, useEffect } from 'react';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const timer = setTimeout(() => { setLoading(false);}, 2500)
    return () => clearTimeout(timer);}, [])
  
    if (loading){
    return <Loader/>
  }
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