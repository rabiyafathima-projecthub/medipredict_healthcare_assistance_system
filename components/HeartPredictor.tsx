// HeartPredictor.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  onBack: () => void;
  onResult: (res: any, location: GeolocationCoordinates | null) => void;
}

const HeartPredictor: React.FC<Props> = ({ onBack, onResult }) => {

  // ⭐ Get User Location
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords),
      () => setUserLocation(null)
    );
  }, []);

  // Internal form
  const [form, setForm] = useState({
    age: 45,
    gender: 0,
    cp: 1,
    trestbps: 130,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2,
  });

  const ranges: any = {
    age: [1, 120, 1],
    gender: [0, 1, 1],
    cp: [0, 3, 1],
    trestbps: [80, 220, 1],
    chol: [100, 500, 1],
    fbs: [0, 1, 1],
    restecg: [0, 2, 1],
    thalach: [60, 220, 1],
    exang: [0, 1, 1],
    oldpeak: [0, 10, 0.1],
    slope: [0, 2, 1],
    ca: [0, 4, 1],
    thal: [0, 3, 1],
  };

  const update = (key: string, delta: number) => {
    const [min, max, step] = ranges[key];
    setForm((prev: any) => {
      const next = Number((prev[key] + delta).toFixed(step === 0.1 ? 1 : 0));
      return { ...prev, [key]: Math.min(Math.max(next, min), max) };
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        age: Number(form.age),
        sex: Number(form.gender),
        cp: Number(form.cp),
        trestbps: Number(form.trestbps),
        chol: Number(form.chol),
        fbs: Number(form.fbs),
        restecg: Number(form.restecg),
        thalach: Number(form.thalach),
        exang: Number(form.exang),
        oldpeak: Number(form.oldpeak),
        slope: Number(form.slope),
        ca: Number(form.ca),
        thal: Number(form.thal),
      };

      const res = await axios.post("http://127.0.0.1:8000/predict/heart", payload);

    // ---- STEP 2: Get user location fresh ----
    const loc: any = await new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        () => resolve(null)
      )
    );

    // ---- STEP 3: SEND correct prediction ----
    onResult(
      {
        ...res.data,
        model_used: "heart",       // <<< VERY IMPORTANT
      },
      loc                           // <<< USE loc, NOT userLocation
    );

  } catch (e) {
    console.error(e);
    alert("Heart prediction failed");
  }
};

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-6 text-center">
        Heart Disease Predictor
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Gender Selector */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Gender
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => setForm({ ...form, gender: 0 })}
              className={`flex-1 py-2 rounded-lg border font-medium ${
                form.gender === 0
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Female
            </button>

            <button
              onClick={() => setForm({ ...form, gender: 1 })}
              className={`flex-1 py-2 rounded-lg border font-medium ${
                form.gender === 1
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-700"
              }`}
            >
              Male
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Select patient's biological gender
          </p>
        </div>

        {/* Numeric Inputs */}
        {Object.keys(form).map((key) => {
          if (key === "gender") return null;

          const [min, max, step] = ranges[key];

          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace("trestbps", "Resting BP")
            .replace("thalach", "Max HR")
            .replace("oldpeak", "ST Depression")
            .replace("restecg", "Rest ECG")
            .replace("ca", "No. of major vessels (ca)");

          return (
            <div key={key} className="bg-white rounded-xl p-4 border shadow-sm">
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                {label}
              </label>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => update(key, -step)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  −
                </button>

                <span className="text-xl font-bold text-teal-600">
                  {form[key]}
                </span>

                <button
                  onClick={() => update(key, step)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Range: {min} – {max}
              </p>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={handleSubmit}
          className="bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-teal-700"
        >
          Predict
        </button>

        <button
          onClick={onBack}
          className="bg-gray-200 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default HeartPredictor;
