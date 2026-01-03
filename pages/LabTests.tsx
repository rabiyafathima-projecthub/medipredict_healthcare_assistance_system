import React from "react";
import {
  FlaskRound,
  TestTube,
  Droplet,
  Activity,
  ChevronRight,
} from "lucide-react";

interface LabItem {
  name: string;
  description: string;
  url: string;
  icon?: any;
  img?: string;
  color: string;
}

const labTests: LabItem[] = [
  {
    name: "Apollo Diagnostics",
    description: "Trusted blood tests & home sample collection.",
    url: "https://www.apollodiagnostics.in/",
    icon: FlaskRound,
    color: "from-purple-100 to-purple-200 text-purple-700",
  },
  {
    name: "Dr. Lal PathLabs",
    description: "India’s leading pathology lab for all tests.",
    url: "https://www.lalpathlabs.com/",
    icon: TestTube,
    color: "from-yellow-100 to-yellow-200 text-yellow-700",
  },
  {
    name: "Thyrocare",
    description: "Affordable full-body checkups & home testing.",
    url: "https://www.thyrocare.com/",
    icon: Droplet,
    color: "from-blue-100 to-blue-200 text-blue-700",
  },
  {
    name: "Metropolis Labs",
    description: "Advanced diagnostics with accurate reports.",
    url: "https://www.metropolisindia.com/",
    icon: Activity,
    color: "from-green-100 to-green-200 text-green-700",
  },

  // ⭐ Image-based labs (not icon-based)
  {
    name: "Redcliffe Labs",
    description: "Affordable diagnostic tests with home sample collection.",
    url: "https://redcliffelabs.com",
    img: "https://www.redcliffelabs.com/images/logo-redcliffe.svg",
    color: "from-red-100 to-red-200",
  },
  {
    name: "Tata 1mg Labs",
    description: "Full body checkups, blood tests & home sample collection.",
    url: "https://www.1mg.com/labs",
    img: "https://res.cloudinary.com/du8msdgbj/image/upload/v1576836789/marketing/one_mg_logo.png",
    color: "from-orange-100 to-orange-200",
  },
];

const LabTests = ({ onBack }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">
        Book Lab Tests
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {labTests.map((lab, index) => (
          <div
            key={index}
            onClick={() => window.open(lab.url, "_blank")}
            className="cursor-pointer p-6 rounded-2xl shadow-md bg-white border hover:shadow-xl transition-all hover:-translate-y-1"
          >
            {/* ICON / IMAGE */}
            <div
              className={`h-20 w-20 rounded-xl bg-gradient-to-br ${lab.color} flex items-center justify-center mb-4`}
            >
              {lab.icon ? (
                <lab.icon className="h-10 w-10" />
              ) : (
                <img src={lab.img} className="h-10 object-contain" />
              )}
            </div>

            {/* NAME */}
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {lab.name}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-slate-600 text-sm mb-4">
              {lab.description}
            </p>

            {/* CTA */}
            <div className="flex items-center text-sm font-medium text-teal-600">
              Book Now <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center mt-10">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-300 rounded-xl font-semibold hover:bg-slate-400 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LabTests;
