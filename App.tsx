import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { SymptomChecker } from "./components/SymptomChecker";
import { Results } from "./components/Results";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ConsultDoctors from "./components/ConsultDoctors";
import LabTests from "./pages/LabTests";
import LabReportSummary from "./pages/LabReportSummary";



import HeartPredictor from "./components/HeartPredictor";
import KidneyPredictor from "./components/KidneyPredictor";
import DiabetesPredictor from "./components/DiabetesPredictor";

import OrderMedicines from "./pages/OrderMedicines";   // ⭐ NEW IMPORT

import { ViewState, PredictionResult } from "./types";
import { Heart, ShieldCheck, Zap } from "lucide-react";

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>("LANDING");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);

  // AUTO LOGIN
  useEffect(() => {
  if (localStorage.getItem("token")) {
    setIsLoggedIn(true);
    // Do NOT redirect automatically
  }
}, []);

  // SIGNUP
  const handleSignupRedirect = () => setView("PROFILE");

  const handleLoginSuccess = (firstLoginFromBackend: number) => {
    setIsLoggedIn(true);
    localStorage.setItem("first_login", String(firstLoginFromBackend));

    if (firstLoginFromBackend === 1) setView("PROFILE");
    else setView("DASHBOARD");
  };

  const handleProfileComplete = () => {
    localStorage.setItem("first_login", "0");
    setView("DASHBOARD");
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setView("LANDING");
  };

  // COMMON HANDLER FOR RESULTS PAGE
  const handlePredict = (
    result: PredictionResult | null,
    list: string[],
    location: GeolocationCoordinates | null
  ) => {
    setPrediction(result);
    setSelectedSymptoms(list);
    setUserLocation(location);
    setView("RESULTS");
  };

  // RENDER ROUTES
  const renderContent = () => {
    switch (view) {
      case "LANDING":
        return (
          <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-teal-50 to-white">
            <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-8">
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900">
                  Your Personal <br />
                  <span className="text-teal-600"> Health Assistant</span>
                </h1>

                <p className="text-lg text-slate-600 max-w-xl">
MediPredict evaluates your symptoms through structured medical algorithms and guides you toward the right health support quickly.                </p>

                <button
                  onClick={() => setView("AUTH")}
                  className="bg-teal-600 text-white px-8 py-4 rounded-xl shadow hover:bg-teal-700 transition"
                >
                  Get Started
                </button>

                <div className="pt-8 flex gap-8 border-t border-gray-200">
                  <div><ShieldCheck className="h-5 w-5 text-teal-600" /> Secure</div>
                  <div><Zap className="h-5 w-5 text-teal-600" /> Fast</div>
                  <div><Heart className="h-5 w-5 text-teal-600" /> Care</div>
                </div>
              </div>

              <div className="flex-1">
                <img
                  src="/homepage-doctor.png" className="rounded-3xl shadow-2xl" 
                  className="rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        );

      case "AUTH":
        return (
          <Auth
            onSignupRedirect={handleSignupRedirect}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case "PROFILE":
        return <Profile onComplete={handleProfileComplete} />;

      case "DASHBOARD":
        return <Dashboard onNavigate={setView} />;

      case "PREDICT":
  return (
    <SymptomChecker 
      onPredict={(result, symptoms, location) =>
        handlePredict({ ...result, model_used: "symptoms" }, symptoms, location)
      }
    />
  );
      case "HEART_PREDICT":
        return (
          <HeartPredictor
            onBack={() => setView("DASHBOARD")}
onResult={(result: any, location: any) =>
  handlePredict(result, [], location)
}          />
        );

      case "KIDNEY_PREDICT":
        return (
        <KidneyPredictor
         onBack={() => setView("DASHBOARD")}
         onResult={(result: any, location: any) =>
          handlePredict(result, [], location)
      }
    />
  );

      case "DIABETES_PREDICT":
        return (
          <DiabetesPredictor
            onBack={() => setView("DASHBOARD")}
             onResult={(result: any, location: any) =>
             handlePredict(result, [], location)
            }
          />
        );

      case "ORDER_MEDICINES":         // ⭐ NEW ROUTE
        return <OrderMedicines />;

      case "RESULTS":
        return (
          <Results
            prediction={prediction}
            selectedSymptoms={selectedSymptoms}
            userLocation={userLocation}
            onReset={() => setView("PREDICT")}
          />
        );
        case "CONSULT_DOCTOR":
  return <ConsultDoctors onBack={() => setView("DASHBOARD")} />;
  case "LAB_TESTS":
  return <LabTests onBack={() => setView("DASHBOARD")} />;
  case "LAB_REPORT":
  return <LabReportSummary />;

      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div>
      <Navbar
        view={view}
        setView={setView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      {renderContent()}
    </div>
  );
};

export default App;
