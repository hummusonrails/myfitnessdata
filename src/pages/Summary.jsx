import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import CollapsibleTable from '../components/CollapsibleTable';
import NutritionistAdvice from '../components/NutritionistAdvice';
import BackgroundScribbles from '../components/BackgroundScribbles';

function Summary() {
  const { nutrition, measurement, exercise } = useData();
  const [hasAll, setHasAll] = useState(false);

  useEffect(() => {
    setHasAll(
      Array.isArray(nutrition) && nutrition.length > 0 &&
      Array.isArray(measurement) && measurement.length > 0 &&
      Array.isArray(exercise) && exercise.length > 0
    );
  }, [nutrition, measurement, exercise]);

  if (!hasAll) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Comprehensive Summary</h1>
        <p className="text-gray-600">Please upload all three CSV files (Nutrition, Measurement, and Exercise) to view your summary.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <BackgroundScribbles />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Your Nutritionist Summary</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Nutrition Overview</h2>
          <CollapsibleTable data={nutrition} />
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Body Measurements</h2>
          <CollapsibleTable data={measurement} />
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Exercise Activity</h2>
          <CollapsibleTable data={exercise} />
        </section>
        <NutritionistAdvice nutrition={nutrition} measurement={measurement} exercise={exercise} />
      </div>
    </div>
  );
}

export default Summary;
