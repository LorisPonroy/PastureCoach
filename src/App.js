import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './features/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import FarmList from './features/farmlist/FarmList';
import Header from './components/Header';
import FarmPage from './features/FarmPage';
import RotationCalculator from './features/rotationCalculator';
import PastureCalculator from './features/PastureCalculator';

function AppContent() {
  const user = JSON.parse(window.sessionStorage.getItem("user"));
  const farms = JSON.parse(window.sessionStorage.getItem("farms"));

  const location = useLocation();

  // Vérifiez si l'utilisateur est sur la page de connexion ou d'inscription
  const showNavigationBar = !['/login'].includes(location.pathname);

  const pathParts = location.pathname.split('/');
  const farmIdIndex = pathParts.findIndex((part) => part === 'farm') + 1;
  const farmID = pathParts.length > farmIdIndex ? pathParts[farmIdIndex] : null;


  return (
    <div>
      {showNavigationBar && user && farms && <Header farmID={farmID} />}
      <Routes>
        {/* Route for unauthenticated users */}
        {
          (!user || !farms) && <Route path="*" element={<Login />} />
        }

        {/* Routes for authenticated users */}
        {user && farms && (
          <>
            <Route path="/" element={<FarmList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farms" element={<FarmList />} />
            <Route path="/farm/:farmID/" element={<FarmPage />} />
            <Route path="/farm/:farmID/tools/rotationCalculator/" element={<RotationCalculator />} />
            <Route path="/farm/:farmID/tools/pastureCalculator/" element={<PastureCalculator />} />
            <Route path='*' element={<FarmList />} />
          </>
        )}
      </Routes>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);


export default App;
