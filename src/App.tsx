

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';
import LoadingScreen from './components/loadingscreen';

import GalaxyBackground from './components/GalaxyBackground';
import { AuthProvider } from './auth/AuthContext';
// import Dashboard from './pages/Dashboard';
import DashboardProjects from './pages/DashboardProjects';
import DashboardSkills from './pages/DashboardSkills';
import DashboardExperiences from './pages/DashboardExperiences';
import ProjectDetail from './pages/ProjectDetail';



function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    // Always sync local state when pathname changes (including direct assignments)
    setPath(window.location.pathname);

    // Simulate loading screen only for landing page.
    if (window.location.pathname !== '/dashboard') {
      setIsLoading(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);


  const isDashboardRoot = useMemo(() => path === '/dashboard', [path]);
  const isDashboardProjects = useMemo(() => path === '/dashboard/projects', [path]);
  const isDashboardSkills = useMemo(() => path === '/dashboard/skills', [path]);
  const isDashboardExperiences = useMemo(() => path === '/dashboard/experiences', [path]);
  const isProjectDetail = useMemo(() => path.startsWith('/project/'), [path]);


  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-transparent text-[#F8F8FC]">
        {!isDashboardRoot && <GalaxyBackground />}

        {isDashboardRoot ? (
          // '/dashboard' root redirect is handled by Navbar to avoid render-time navigation issues.
          null
        ) : isDashboardProjects ? (
          <DashboardProjects />
        ) : isDashboardSkills ? (
          <DashboardSkills />
        ) : isDashboardExperiences ? (
          <DashboardExperiences />
        ) : isProjectDetail ? (
          <ProjectDetail />
        ) : (
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
            ) : (
              <>
                <Navbar />
                <main>
                  <div className="pt-24">
                    <Hero />
                    <About />
                    <Skills />
                    <Projects />
                    <Experience />
                    <Footer />
                  </div>
                </main>

                <style>{`html { scroll-padding-top: 96px; }`}</style>
              </>
            )}
          </AnimatePresence>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;




