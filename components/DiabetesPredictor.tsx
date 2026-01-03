import React, { useState,useEffect } from "react";
import axios from "axios";
import { Minus, Plus } from "lucide-react";

const DiabetesPredictor = ({ onBack, onResult }: any) => {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords),
      () => setUserLocation(null)
    );
  }, []);
  const [form, setForm] = useState({
    Pregnancies: 0,
    Glucose: 100,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 80,
    BMI: 22,
    DiabetesPedigreeFunction: 0.5,
    Age: 30,
  });

  const ranges: any = {
    Pregnancies: [0, 15],
    Glucose: [50, 250],
    BloodPressure: [40, 130],
    SkinThickness: [5, 99],
    Insulin: [10, 900],
    BMI: [10, 60],
    DiabetesPedigreeFunction: [0, 3],
    Age: [1, 100],
  };

  const update = (key: string, v: number) => {
    const [min, max] = ranges[key];
    setForm((prev) => ({
      ...prev,
      [key]: Math.min(Math.max(prev[key] + v, min), max),
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/predict/diabetes",
        form
      );

      onResult(
        { ...res.data, model_used: "diabetes" },
        userLocation   // ⭐ IMPORTANT
      );

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
        Diabetes Prediction
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.keys(form).map((key) => {
          const [min, max] = ranges[key];
          return (
            <div
              key={key}
              className="bg-white rounded-xl shadow p-5 border border-gray-100"
            >
              <h3 className="text-gray-800 font-semibold mb-3">
                {key.replace(/([A-Z])/g, " $1")}
              </h3>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => update(key, -1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  <Minus size={16} />
                </button>

                <span className="text-2xl font-bold text-teal-600">
                  {form[key]}
                </span>

                <button
                  onClick={() => update(key, 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-2">
                Range: {min} – {max}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700"
        >
          Predict
        </button>
        <button
          onClick={onBack}
          className="bg-gray-300 text-black px-8 py-3 rounded-xl font-semibold"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default DiabetesPredictor;
