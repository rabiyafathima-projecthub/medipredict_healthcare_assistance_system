import React from 'react';
import {
  Activity,
  Pill,
  UserPlus,
  FileText,
  HeartPulse,
  Droplet,
  Syringe,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  
  // ⭐ Load user name from localStorage
  const name = localStorage.getItem("name") || "";

  // ⭐ All dashboard cards including NEW disease predictors
  const cards = [
    {
      title: 'Check Symptoms',
      desc: 'Use our symptom-based prediction system.',
      icon: Activity,
      action: () => onNavigate('PREDICT'),
      color: 'bg-teal-500',
    },
    {
      title: 'Heart Disease Check',
      desc: 'Predict heart disease using medical parameters.',
      icon: HeartPulse,
      action: () => onNavigate('HEART_PREDICT'),
      color: 'bg-red-500',
    },
    {
      title: 'Kidney Disease Check',
      desc: 'Use clinical values to check kidney function.',
      icon: Droplet,
      action: () => onNavigate('KIDNEY_PREDICT'),
      color: 'bg-green-500',
    },
    {
      title: 'Diabetes Check',
      desc: 'Predict diabetes using glucose & body metrics.',
      icon: Syringe,
      action: () => onNavigate('DIABETES_PREDICT'),
      color: 'bg-orange-500',
    },
    {
  title: 'Order Medicines',
  desc: 'Connect with online pharmacies for quick delivery.',
  icon: Pill,
  action: () => onNavigate("ORDER_MEDICINES"),
  color: 'bg-blue-500',
},
    {
  title: 'Consult Doctor',
  desc: 'Choose from trusted online doctor platforms.',
  icon: UserPlus,
  action: () => onNavigate("CONSULT_DOCTOR"),
  color: 'bg-indigo-500',
},
    {
  title: "Book Lab Tests",
  desc: "Home sample collection from trusted labs.",
  icon: FileText,
  action: () => onNavigate("LAB_TESTS"),
  color: "bg-purple-500",
},
{
    title: "Lab Report Summary",
    desc: "Upload your lab report & get short summary.",
    icon: FileText,
    action: () => onNavigate("LAB_REPORT"),
    color: "bg-pink-500",
  },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {name}
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your health and access quick services.
        </p>
      </div>

      {/* GRID OF CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.action}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`h-2 ${card.color}`} />
            <div className="p-6">
              
              <div className={`inline-flex p-3 rounded-lg ${card.color} bg-opacity-10 mb-4`}>
                <card.icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
                {card.title}
              </h3>

              <p className="text-gray-500 text-sm mb-4">
                {card.desc}
              </p>

              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-teal-600">
                Go Now <ChevronRight className="h-4 w-4 ml-1" />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-12 bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl shadow-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why choose MediPredict?</h2>
          <p className="text-teal-100 mb-6">
            MediPredict helps you understand symptoms, identify possible illnesses, and access health services easily.
          </p>
          <button
            onClick={() => onNavigate('PREDICT')}
            className="bg-white text-teal-800 px-6 py-3 rounded-lg font-bold hover:bg-teal-50 transition-colors"
          >
            Start a Checkup
          </button>
        </div>

        <div className="hidden md:block">
          <Activity className="h-32 w-32 text-teal-400 opacity-50" />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
