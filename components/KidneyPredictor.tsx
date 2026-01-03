// KidneyPredictor.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  onBack: () => void;
  onResult: (res: any) => void;
}

const KidneyPredictor: React.FC<Props> = ({ onBack, onResult }) => {
  // ⭐ Add this block here
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords),
      () => setUserLocation(null)
    );
  }, []);
  const [form, setForm] = useState({
    age: 40,
    bp: 80, // blood pressure
    sg: 1.02, // specific gravity
    al: 0, // albumin 0-5
    su: 0, // sugar 0-5
    bgr: 120, // blood glucose random
    bu: 20, // blood urea
    sc: 1.0, // serum creatinine
    hemo: 13.5, // hemoglobin
    wbcc: 8000, // white blood cell count
    rbcc: 4.5, // red blood cell count
  });

  const ranges: any = {
    age: [1, 120, 1],
    bp: [40, 200, 1],
    sg: [1.005, 1.030, 0.001], // will operate with 0.01 stepping in UI
    al: [0, 5, 1],
    su: [0, 5, 1],
    bgr: [40, 500, 1],
    bu: [5, 200, 1],
    sc: [0.2, 15.0, 0.1],
    hemo: [3.0, 20.0, 0.1],
    wbcc: [1000, 30000, 100],
    rbcc: [2.0, 8.0, 0.1],
  };

  // helper adjust — uses different visible step for sg because 0.001 is too small for +/- buttons
  const adjust = (key: string, delta: number) => {
    const [min, max, step] = ranges[key];
    setForm((prev: any) => {
      const raw = prev[key] + delta;
      // rounding rules
      let next;
      if (step >= 1) next = Math.round(raw);
      else if (step === 0.1) next = Math.round(raw * 10) / 10;
      else next = Math.round(raw * 100) / 100; // for sg approximate to 0.01 steps visually
      const clamped = Math.min(Math.max(next, min), max);
      return { ...prev, [key]: clamped };
    });
  };

  const handleSubmit = async () => {
    try {
      // ensure numeric cast
      const payload = {
        ...form,
        age: Number(form.age),
        bp: Number(form.bp),
        sg: Number(form.sg),
        al: Number(form.al),
        su: Number(form.su),
        bgr: Number(form.bgr),
        bu: Number(form.bu),
        sc: Number(form.sc),
        hemo: Number(form.hemo),
        wbcc: Number(form.wbcc),
        rbcc: Number(form.rbcc),
      };

      const res = await axios.post("http://127.0.0.1:8000/predict/kidney", payload);
      onResult({ ...res.data, model_used: "kidney" }, userLocation);

    } catch (err) {
      console.error(err);
      alert("Kidney prediction failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-6 text-center">
        Kidney Disease Predictor
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(form).map((key) => {
          const [min, max, step] = ranges[key];
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace("bp", "Blood Pressure")
            .replace("sg", "Specific Gravity")
            .replace("bgr", "Blood Glucose (random)")
            .replace("bu", "Blood Urea")
            .replace("sc", "Serum Creatinine")
            .replace("hemo", "Hemoglobin")
            .replace("wbcc", "WBC count")
            .replace("rbcc", "RBC count");

          return (
            <div key={key} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
              </label>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => adjust(key, step >= 1 ? -step : -(step === 0.001 ? 0.01 : step))}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  −
                </button>

                <span className="text-xl font-bold text-teal-600">
                  {form[key]}
                </span>

                <button
                  onClick={() => adjust(key, step >= 1 ? step : (step === 0.001 ? 0.01 : step))}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
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

export default KidneyPredictor;
