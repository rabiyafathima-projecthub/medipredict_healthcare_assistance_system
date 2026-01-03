import React from "react";
import { Stethoscope, HeartPulse, PhoneCall, UserPlus, Hospital } from "lucide-react";

const doctorPlatforms = [
  {
    name: "Practo",
    description: "Online doctor consultations & instant appointments.",
    url: "https://www.practo.com",
    icon: Stethoscope,
    color: "from-blue-100 to-blue-200 text-blue-700",
  },
  {
    name: "Apollo 24/7",
    description: "Consult top Apollo doctors online.",
    url: "https://www.apollo247.com",
    icon: HeartPulse,
    color: "from-teal-100 to-teal-200 text-teal-700",
  },
  {
  name: "MFine",
  description: "Instant online doctor consultation with specialists.",
  url: "https://www.mfine.co",
  icon: PhoneCall,
  color: "from-orange-100 to-orange-200 text-orange-700",
},
{
  name: "DocOnline",
  description: "Trusted online doctor consultations for general and specialist care.",
  url: "https://www.doconline.com",
  icon: PhoneCall,
  color: "from-blue-100 to-blue-200 text-blue-700",
},
  {
    name: "MediBuddy",
    description: "Chat or video consult with expert doctors.",
    url: "https://www.medibuddy.in",
    icon: UserPlus,
    color: "from-purple-100 to-purple-200 text-purple-700",
  },
  {
    name: "Lybrate",
    description: "Consult trusted doctors across India.",
    url: "https://www.lybrate.com",
    icon: Hospital,
    color: "from-pink-100 to-pink-200 text-pink-700",
  },
];

export default function ConsultDoctors({ onBack }: any) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Consult a Doctor Online
      </h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorPlatforms.map((doc, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl shadow-md bg-gradient-to-br ${doc.color} cursor-pointer hover:shadow-xl transition`}
            onClick={() => window.open(doc.url, "_blank")}
          >
            <doc.icon className="h-10 w-10 mb-4" />

            <h2 className="text-xl font-bold mb-2">{doc.name}</h2>
            <p className="text-sm text-slate-700 mb-4">{doc.description}</p>

            <button className="bg-white text-slate-800 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100">
              Visit Website
            </button>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="text-center mt-10">
        <button
          onClick={onBack}
          className="bg-slate-300 px-6 py-2 rounded-lg text-slate-800 font-semibold hover:bg-slate-400"
        >
          Back
        </button>
      </div>
    </div>
  );
}
