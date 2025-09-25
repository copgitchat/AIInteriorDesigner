import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Star, Award, Download } from 'lucide-react';

const UserProfile: React.FC = () => {
  const achievements = [
    { title: 'Design Explorer', description: 'Completed 5+ design projects', icon: Star, earned: true },
    { title: 'Budget Master', description: 'Stayed within budget on 3 projects', icon: Award, earned: true },
    { title: 'Early Adopter', description: 'One of the first 1000 users', icon: Calendar, earned: false },
  ];

  const recentActivity = [
    { action: 'Generated design for Modern Living Room', date: '2 hours ago' },
    { action: 'Uploaded blueprint for Office Space', date: '1 day ago' },
    { action: 'Downloaded cost estimate report', date: '3 days ago' },
    { action: 'Shared Bedroom Design with contractor', date: '1 week ago' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">John Doe</h1>
            <p className="text-blue-100 mb-4">Premium Member since January 2024</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>john.doe@email.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projects Created</span>
                <span className="font-bold text-2xl text-blue-600">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Designs Generated</span>
                <span className="font-bold text-2xl text-green-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost Reports</span>
                <span className="font-bold text-2xl text-purple-600">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shared Projects</span>
                <span className="font-bold text-2xl text-orange-600">15</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <h4 className={`font-medium ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  defaultValue="123 Design Street, New York, NY 10001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
              <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Activity</span>
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-gray-500 text-sm">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;