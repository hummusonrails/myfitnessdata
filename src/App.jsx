import React from 'react';
import { useData } from './context/DataContext';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import Nutrition from './pages/Nutrition';
import Measurement from './pages/Measurement';
import Exercise from './pages/Exercise';
import Interplay from './pages/Interplay';
import Landing from './pages/Landing';
import Footer from './components/Footer';
import Privacy from './pages/Privacy';
import PersonalHealthReport from './pages/PersonalHealthReport';

function App() {
  const { nutrition, measurement, exercise } = useData();
  const hasAllData = Array.isArray(nutrition) && nutrition.length > 0 &&
    Array.isArray(measurement) && measurement.length > 0 &&
    Array.isArray(exercise) && exercise.length > 0;
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow mb-6 z-20 relative">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}>Home</NavLink>
            </div>
            <div className="flex gap-6">
              <NavLink to="/nutrition" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}>Nutrition</NavLink>
              <NavLink to="/measurement" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}>Measurement</NavLink>
              <NavLink to="/exercise" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}>Exercise</NavLink>
              <NavLink to="/interplay" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}>Interplay</NavLink>
              {hasAllData && (
                <NavLink to="/personal-health-report" className={({ isActive }) => isActive ? 'text-green-700 font-bold' : 'text-gray-700 hover:text-green-700'}>
                  Personal Nutrition Report
                </NavLink>
              )}
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/measurement" element={<Measurement />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/interplay" element={<Interplay />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/personal-health-report" element={<PersonalHealthReport />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
