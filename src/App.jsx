import { HashRouter, Routes, Route } from 'react-router-dom';
import IdeaGenerator from './Components/IdeaGenerator.jsx';
import HomePage from './HomePage.jsx';
import AboutPage from './AboutPage.jsx';
import ProjectShowcase from './ProjectShowcase.jsx';
import Support from './Support.jsx';
import Loader from './Components/Loader.jsx';
import { SubscriptionProvider } from './Context/SubscriptionContext.jsx';
import { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { 
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader/>;
  }

  return (
    <>
      <SubscriptionProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Generator" element={<IdeaGenerator />} />
            <Route path="/About" element={<AboutPage />} />
            <Route path="/showcase" element={<ProjectShowcase />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </HashRouter>
      </SubscriptionProvider>
    </>
  );
}

export default App;