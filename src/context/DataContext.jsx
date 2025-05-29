import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [nutrition, setNutritionState] = useState(() => {
    const stored = localStorage.getItem('nutrition');
    return stored ? JSON.parse(stored) : [];
  });
  const [measurement, setMeasurementState] = useState(() => {
    const stored = localStorage.getItem('measurement');
    return stored ? JSON.parse(stored) : [];
  });
  const [exercise, setExerciseState] = useState(() => {
    const stored = localStorage.getItem('exercise');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('nutrition', JSON.stringify(nutrition));
  }, [nutrition]);
  useEffect(() => {
    localStorage.setItem('measurement', JSON.stringify(measurement));
  }, [measurement]);
  useEffect(() => {
    localStorage.setItem('exercise', JSON.stringify(exercise));
  }, [exercise]);

  const setNutrition = (data) => setNutritionState(data);
  const setMeasurement = (data) => setMeasurementState(data);
  const setExercise = (data) => setExerciseState(data);

  const resetAll = () => {
    setNutritionState([]);
    setMeasurementState([]);
    setExerciseState([]);
    localStorage.removeItem('nutrition');
    localStorage.removeItem('measurement');
    localStorage.removeItem('exercise');
  };

  return (
    <DataContext.Provider value={{ nutrition, setNutrition, measurement, setMeasurement, exercise, setExercise, resetAll }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
