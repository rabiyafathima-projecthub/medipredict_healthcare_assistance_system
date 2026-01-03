import React from 'react';
import { ViewState } from '../types';
import { Stethoscope, User, LogOut } from 'lucide-react';

interface NavbarProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView, isLoggedIn, onLogout }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo - Go to Dashboard if logged in, else Landing */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setView(isLoggedIn ? 'DASHBOARD' : 'LANDING')}
          >
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-teal-600 p-2 rounded-full">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-teal-800 tracking-tight">
                MediPredict
              </span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => setView('DASHBOARD')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'DASHBOARD'
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => setView('PREDICT')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === 'PREDICT'
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  Predict Disease
                </button>

                {/* User Profile + Logout */}
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {localStorage.getItem("name") ?? "User"}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              // 🔥 Updated here: LOGIN → AUTH
              <button
                onClick={() => setView('AUTH')}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
