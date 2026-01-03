import React, { useEffect, useState } from "react";
import axios from "axios";

interface ResultsProps {
  prediction: any;
  selectedSymptoms: string[];
  userLocation: GeolocationCoordinates | null;
  onReset: () => void;
}

type Hospital = {
  name: string;
  address: string;
  distance_km: number;
  lat: number;
  lon: number;
  map_url?: string;
};

const DEFAULT_RADIUS = 10000; // 10 km

export const Results: React.FC<ResultsProps> = ({
  prediction,
  selectedSymptoms,
  userLocation,
  onReset,
}) => {  console.log("RESULT RECEIVED:", prediction);   // <-- ADD HERE

  if (!prediction) return <div>No results available</div>;

  // -----------------------
  // SUPPORT ALL RESULT TYPES
  // -----------------------
  const disease = prediction.disease || prediction.prediction || "Unknown";

  const severity =
    prediction.severity ||
    prediction.risk_level ||
    "Moderate";

  const description =
    prediction.description ||
    prediction.advice ||
    "No description available.";

  const prevention = prediction.prevention || [];
  const tips = prediction.tips || [];

  const probability = prediction.probability;

  const severityColor =
    severity === "High"
      ? "bg-red-100 text-red-700"
      : severity === "Moderate"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-teal-100 text-teal-700";

  // -----------------------
  // HOSPITAL SEARCH
  // -----------------------
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState<boolean>(false);
  const [hospitalError, setHospitalError] = useState<string | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lon: number } | null>(
    userLocation ? { lat: userLocation.latitude, lon: userLocation.longitude } : null
  );
const fetchHospitals = async (lat: number, lon: number) => {
  try {
    setLoadingHospitals(true);

    // If heart disease → fetch only heart-related hospitals
    let specialtyParam = "";
if (prediction?.model_used === "heart") specialtyParam = "&specialty=heart";
if (prediction?.model_used === "kidney") specialtyParam = "&specialty=kidney";
if (prediction?.model_used === "diabetes") specialtyParam = "&specialty=diabetes";

    const res = await axios.get(
      `http://127.0.0.1:8000/tools/hospitals?lat=${lat}&lon=${lon}&radius=${DEFAULT_RADIUS}${specialtyParam}`
    );

let list = (res.data?.hospitals ?? []).map((h: any) => ({
      name: h.name,
      address: h.address,
      distance_km: h.distance_km ?? h.distance ?? 0,
      lat: h.lat,
      lon: h.lon,
      map_url: h.map_url,
    }));

    setHospitals(list);
    setMapCenter({ lat, lon });
  } catch (err: any) {
    console.error(err);
    setHospitalError("Could not fetch hospitals.");
    setHospitals([]);
  } finally {
    setLoadingHospitals(false);
  }
};

 useEffect(() => {
  if (!userLocation || !prediction?.model_used) return;

  const isHeart = prediction.model_used === "heart";
  const isKidney = prediction.model_used === "kidney";
  const isDiabetes = prediction.model_used === "diabetes";


  const diseaseName = (prediction?.disease || "").toLowerCase();
  const severityLevel = (prediction?.severity || "").toLowerCase();

  // 🚫 Block hospitals only for LOW severity
  if ((isHeart || isKidney || isDiabetes) &&
    (diseaseName === "healthy" || severityLevel === "low"))  {
    setHospitals([]);
    return;
  }
  // Symptom checker → always fetch hospitals
if (prediction.model_used === "symptoms") {
  fetchHospitals(userLocation.latitude, userLocation.longitude);
  return;
}

  // ✅ Fetch correct specialty
  fetchHospitals(userLocation.latitude, userLocation.longitude);

}, [userLocation, prediction?.model_used]);

  // -----------------------
  // CITY SEARCH (fallback)
  // -----------------------
  const handleCitySearch = async () => {
    if (!cityQuery || cityQuery.length < 2) return;

    setGeocodeLoading(true);
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: cityQuery, format: "json", limit: 1 },
        }
      );

      if (!res.data[0]) {
        setHospitalError("Location not found.");
        return;
      }

      const lat = parseFloat(res.data[0].lat);
      const lon = parseFloat(res.data[0].lon);

      setMapCenter({ lat, lon });
      fetchHospitals(lat, lon);
    } catch {
      setHospitalError("City search failed.");
    } finally {
      setGeocodeLoading(false);
    }
  };

  // -----------------------
  // MAP EMBED
  // -----------------------
  const mapIframeSrc = () => {
    if (!mapCenter) return "";
    const { lat, lon } = mapCenter;
    const delta = 0.05;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - delta},${lat - delta},${lon + delta},${lat + delta}&layer=mapnik&marker=${lat},${lon}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-slate-900 mb-6">
        Health Prediction Result
      </h1>

      {/* MAIN RESULT CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <h2 className="text-3xl font-bold text-teal-700">
          {disease}
        </h2>

        <span className={`inline-block px-4 py-1 mt-2 rounded-full text-sm font-semibold ${severityColor}`}>
          Severity: {severity}
        </span>

        {/* Probability & Risk (for diabetes/heart/kidney) */}
        {probability !== undefined && probability !== null && (
          <p className="mt-2 text-gray-700">
            <strong>Risk Probability:</strong>{" "}
            {(probability * 100).toFixed(1)}%
          </p>
        )}

        <p className="text-slate-700 mt-4 text-lg">{description}</p>
      </div>

      {/* SYMPTOMS */}
      {selectedSymptoms.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Your Symptoms
          </h3>

          <div className="flex flex-wrap gap-3">
            {selectedSymptoms.map((s, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-teal-100 text-teal-700 rounded-xl text-sm font-medium"
              >
                {s.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TIPS */}
      {tips.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Suggested Health Tips
          </h3>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            {tips.map((t: string, i: number) => (
              <li key={i} className="text-lg">{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* PREVENTION */}
      {prevention.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Prevention Steps
          </h3>
          <ul className="list-disc ml-6 space-y-2 text-slate-700">
            {prevention.map((p: string, i: number) => (
              <li key={i} className="text-lg">{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* HOSPITALS + MAP */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAP */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Nearby Hospitals (10 km)
          </h3>

          {mapCenter && (
            <iframe
              title="map"
              src={mapIframeSrc()}
              className="w-full h-80 rounded border mb-4"
            />
          )}

          {loadingHospitals && <p className="text-slate-500">Fetching hospitals...</p>}
          {hospitalError && <p className="text-red-500">{hospitalError}</p>}

          {!loadingHospitals && hospitals.length === 0 && (
            <div className="text-slate-600">
              <p>No hospitals found. Enter a city:</p>

              <div className="flex gap-2 mt-3">
                <input
                  placeholder="Enter city"
                  className="border px-3 py-2 rounded w-full"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                />

                <button
                  onClick={handleCitySearch}
                  className="bg-teal-600 text-white px-4 py-2 rounded"
                >
                  {geocodeLoading ? "..." : "Search"}
                </button>
              </div>
            </div>
          )}

          {/* TOP 3 HOSPITALS */}
          {hospitals.slice(0, 3).map((h, idx) => (
            <div key={idx} className="p-3 border rounded mt-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-teal-700">{h.name}</h4>
                  <p className="text-sm text-slate-600">{h.address}</p>
                </div>
                <a
                  href={h.map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-teal-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Maps
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* FULL LIST */}
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow border">
          <h4 className="text-xl font-bold mb-3">All Results</h4>

          {hospitals.length === 0 ? (
            <p className="text-slate-500">No hospitals available.</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-auto">
              {hospitals.map((h, idx) => (
                <div
                  key={idx}
                  className="border p-3 rounded flex justify-between"
                >
                  <div>
                    <h5 className="font-semibold text-teal-700">{h.name}</h5>
                    <p className="text-sm text-slate-600">{h.address}</p>
                  </div>
                  <a
                    href={h.map_url}
                    className="bg-teal-600 text-white px-3 py-1 rounded text-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Map
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RESET BUTTON */}
      <div className="mt-10 text-center">
        <button
          onClick={onReset}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow hover:bg-teal-700"
        >
          Check Another Condition
        </button>
      </div>
    </div>
  );
};

export default Results;
