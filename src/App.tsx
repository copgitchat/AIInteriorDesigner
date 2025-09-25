import React, { useState } from 'react';
import { Home, Upload, Eye, Calculator, Settings, User, Menu, X } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BlueprintUpload from './components/BlueprintUpload';
import DesignViewer from './components/DesignViewer';
import CostEstimator from './components/CostEstimator';
import UserProfile from './components/UserProfile';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedBlueprint, setUploadedBlueprint] = useState<string | null>(null);
  const [generatedDesign, setGeneratedDesign] = useState<any>(null);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Blueprint', icon: Upload },
    { id: 'viewer', label: '3D Viewer', icon: Eye },
    { id: 'cost', label: 'Cost Estimator', icon: Calculator },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'upload':
        return (
          <BlueprintUpload
            onBlueprintUpload={setUploadedBlueprint}
            onDesignGenerate={setGeneratedDesign}
            onNavigate={setCurrentView}
          />
        );
      case 'viewer':
        return (
          <DesignViewer
            blueprint={uploadedBlueprint}
            design={generatedDesign}
          />
        );
      case 'cost':
        return <CostEstimator design={generatedDesign} />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-white lg:shadow-lg lg:border-r lg:border-gray-200">
          <nav className="flex-1 px-4 py-8 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-4 lg:p-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;