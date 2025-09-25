import React from 'react';
import { Upload, Eye, Calculator, TrendingUp, Clock, Star, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Projects Created', value: '24', change: '+12%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Hours Saved', value: '156', change: '+8%', icon: Clock, color: 'text-blue-600' },
    { label: 'Designs Generated', value: '89', change: '+24%', icon: Star, color: 'text-purple-600' },
  ];

  const recentProjects = [
    { name: 'Modern Living Room', type: 'Residential', status: 'Completed', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg' },
    { name: 'Office Space Design', type: 'Commercial', status: 'In Progress', image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg' },
    { name: 'Bedroom Renovation', type: 'Residential', status: 'Review', image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg' },
  ];

  const quickActions = [
    { label: 'Upload New Blueprint', action: () => onNavigate('upload'), icon: Upload, color: 'bg-blue-600' },
    { label: 'View 3D Designs', action: () => onNavigate('viewer'), icon: Eye, color: 'bg-green-600' },
    { label: 'Cost Estimation', action: () => onNavigate('cost'), icon: Calculator, color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Welcome back, John!</h2>
          <p className="text-blue-100 text-lg mb-6">
            Transform your spaces with AI-powered interior design. Upload blueprints, generate stunning 3D visualizations, and get accurate cost estimates.
          </p>
          <button
            onClick={() => onNavigate('upload')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Start New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.color} mt-1`}>{stat.change} from last month</p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-left group`}
              >
                <Icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h4 className="font-semibold text-lg">{action.label}</h4>
                <ArrowRight className="w-5 h-5 mt-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Projects</h3>
          <button className="text-blue-600 hover:text-blue-800 font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((project, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{project.name}</h4>
              <p className="text-gray-500 text-sm">{project.type}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;