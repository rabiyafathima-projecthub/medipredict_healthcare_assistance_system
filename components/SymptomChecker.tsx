import React, { useState, useEffect } from "react";
import axios from "axios";

interface SymptomCheckerProps {
  onPredict: (
    result: any,
    selectedSymptoms: string[],
    userLocation: GeolocationCoordinates | null
  ) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onPredict }) => {
  
  // ⭐ FEVER-FOCUSED SYMPTOMS
  const symptomList = [
  "fever",
  "chills",
  "fatigue",
  "weakness",
  "body_ache",
  "joint_pain",
  "headache",
  "loss_of_appetite",
  "night_sweats",
  "dizziness",

  "nausea",
  "vomiting",
  "abdominal_pain",
  "diarrhea",

  "rash",
  "bleeding_gums",

  "yellow_eyes",
  "itching",

  "cough",
  "shortness_of_breath",
  "chest_pain",

  "high_bp_signs",
  "low_bp_signs",
  "dry_mouth",
];


  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);

  // Detect user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation(pos.coords),
      () => setUserLocation(null)
    );
  }, []);

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handlePredict = async () => {
    if (selected.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }

    setLoading(true);

    // Convert selected symptoms → payload matching backend
    const payload: any = {};
    symptomList.forEach((sym) => {
      payload[sym] = selected.includes(sym) ? 1 : 0;
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict/symptoms",
        payload
      );

    onPredict(
    { ...response.data, model_used: "symptoms" },
    selected,
     userLocation
    );
    } catch (err) {
      alert("Could not connect to backend. Ensure FastAPI is running.");
    }

    setLoading(false);
  };

  const filteredSymptoms = symptomList.filter((sym) =>
    sym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">

      {/* HEADER SECTION */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Symptom Checker</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Select all symptoms you are experiencing to get an accurate prediction.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search symptom (ex: fever, rash, jaundice...)"
          className="w-full md:w-2/3 px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* SYMPTOM GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
        {filteredSymptoms.map((sym, index) => (
          <button
            key={index}
            onClick={() => toggleSymptom(sym)}
            className={`
              px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200
              ${
                selected.includes(sym)
                  ? "bg-teal-600 text-white border-teal-700 shadow-md scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:border-teal-500"
              }
            `}
          >
            {sym.replace(/_/g, " ").toUpperCase()}
          </button>
        ))}

        {filteredSymptoms.length === 0 && (
          <p className="text-gray-400 text-center col-span-3">
            No symptoms found. Try another search.
          </p>
        )}
      </div>

      {/* PREDICT BUTTON (fixed bottom for mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-white py-4 shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-teal-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing Symptoms..." : "Predict Disease"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
