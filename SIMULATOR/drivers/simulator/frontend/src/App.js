import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DriversList from './pages/DriversList';
import DeliveryMap from './pages/DeliveryMap';
import Sidebar from './components/Sidebar';

// Global Styles
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <MainContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContentWrapper>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/drivers" element={<DriversList />} />
                <Route path="/map" element={<DeliveryMap />} />
              </Routes>
            </ContentWrapper>
          </MainContent>
        </div>
      </AppContainer>
    </Router>
  );
}

export default App; 