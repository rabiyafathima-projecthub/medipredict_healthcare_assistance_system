import React from "react";
import { ExternalLink } from "lucide-react";

interface PharmacyCard {
  name: string;
  desc: string;
  link: string;
  gradient: string;
  logo: string;
}

const pharmacies: PharmacyCard[] = [
  {
    name: "PharmEasy",
    desc: "Medicines, health products & diagnostics.",
    link: "https://pharmeasy.in",
    gradient: "from-teal-100 to-green-200",
    logo: "https://assets.pharmeasy.in/web-assets/dist/pharmeasy-logo.png",
  },
  {
    name: "Tata 1mg",
    desc: "Online pharmacy & lab check-ups.",
    link: "https://www.1mg.com",
    gradient: "from-orange-100 to-yellow-200",
    logo: "https://onemg.gumlet.io/logo/1mg-logo.png",
  },
  {
    name: "NetMeds",
    desc: "Doorstep delivery for medicines.",
    link: "https://netmeds.com",
    gradient: "from-indigo-100 to-violet-200",
    logo: "https://www.netmeds.com/images/cms/logo/netmeds-new-logo.svg",
  },
  {
    name: "Apollo Pharmacy",
    desc: "India’s trusted pharmacy & wellness.",
    link: "https://www.apollopharmacy.in",
    gradient: "from-cyan-100 to-emerald-200",
    logo: "https://cdn.apollohospitals.com/apollopharmacy/files/logo.png",
  },
  {
    name: "Truemeds",
    desc: "Affordable generic medicines.",
    link: "https://www.truemeds.in",
    gradient: "from-blue-100 to-cyan-200",
    logo: "https://assets.truemeds.in/static/images/logo.png",
  },
  {
    name: "MedPlus",
    desc: "Wide range of medicines & products.",
    link: "https://www.medplusmart.com",
    gradient: "from-pink-100 to-red-200",
    logo: "https://www.medplusmart.com/images/medplusmart-logo.png",
  },
];

export default function OrderMedicines() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-10">
        Order Medicines Online
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacies.map((p, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-md bg-gradient-to-br ${p.gradient} 
              border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300`}
          >
            {/* Icon Badge */}
            <div className="w-14 h-14 bg-white rounded-full shadow flex items-center justify-center mx-auto mb-3">
              <img
                src={p.logo}
                alt={p.name}
                className="h-8 w-8 object-contain"
              />
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-center text-slate-800">
              {p.name}
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-sm text-center mt-1 mb-4 px-1">
              {p.desc}
            </p>

            {/* Button */}
            <button
              onClick={() => window.open(p.link, "_blank")}
              className="w-full bg-teal-600 text-white py-2 rounded-xl font-semibold 
              flex items-center justify-center gap-1 hover:bg-teal-700 transition"
            >
              Visit Store <ExternalLink size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
