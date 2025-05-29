import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [nutrition, setNutrition] = useState([]);
  const [measurement, setMeasurement] = useState([]);
  const [exercise, setExercise] = useState([]);

  return (
    <DataContext.Provider value={{ nutrition, setNutrition, measurement, setMeasurement, exercise, setExercise }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
