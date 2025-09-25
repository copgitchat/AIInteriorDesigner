import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calculator, Download, PieChart } from 'lucide-react';

interface CostEstimatorProps {
  design?: any;
}

const CostEstimator: React.FC<CostEstimatorProps> = ({ design }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const costBreakdown = [
    { category: 'Furniture', amount: 12500, percentage: 50, color: 'bg-blue-500', items: ['Sofas', 'Tables', 'Chairs', 'Storage'] },
    { category: 'Lighting', amount: 3200, percentage: 13, color: 'bg-yellow-500', items: ['Ceiling Lights', 'Floor Lamps', 'Wall Sconces'] },
    { category: 'Decor', amount: 2800, percentage: 11, color: 'bg-green-500', items: ['Art', 'Plants', 'Accessories', 'Textiles'] },
    { category: 'Flooring', amount: 4200, percentage: 17, color: 'bg-purple-500', items: ['Hardwood', 'Rugs', 'Installation'] },
    { category: 'Paint & Wall', amount: 2300, percentage: 9, color: 'bg-red-500', items: ['Paint', 'Wallpaper', 'Wall Treatments'] },
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0);

  const roomCosts = [
    { name: 'Living Room', cost: 8500, items: 15 },
    { name: 'Master Bedroom', cost: 6200, items: 12 },
    { name: 'Kitchen', cost: 7800, items: 18 },
    { name: 'Bathroom', cost: 2500, items: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cost Estimation</h2>
            <p className="text-gray-600">Detailed breakdown of your interior design budget</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-green-800 font-semibold">Budget: $30,000</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Total Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold">${totalCost.toLocaleString()}</h3>
          <p className="text-blue-100">Total Estimated Cost</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Calculator className="w-8 h-8 text-green-600" />
            <span className="text-green-600 text-sm font-medium">83% of Budget</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">$5,000</h3>
          <p className="text-gray-500">Remaining Budget</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="w-8 h-8 text-purple-600" />
            <span className="text-purple-600 text-sm font-medium">4 Rooms</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">53</h3>
          <p className="text-gray-500">Total Items</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">$</span>
            </span>
            <span className="text-yellow-600 text-sm font-medium">Per Sq Ft</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">$32</h3>
          <p className="text-gray-500">Average Cost</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Breakdown Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Cost Breakdown by Category</h3>
          
          {/* Visual Chart */}
          <div className="mb-8">
            <div className="flex h-8 rounded-lg overflow-hidden">
              {costBreakdown.map((item, index) => (
                <div
                  key={index}
                  className={`${item.color} flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${item.percentage}%` }}
                >
                  {item.percentage}%
                </div>
              ))}
            </div>
          </div>

          {/* Category Details */}
          <div className="space-y-4">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.category}</h4>
                    <p className="text-gray-500 text-sm">{item.items.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${item.amount.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">{item.percentage}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room-by-Room Costs */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Cost by Room</h3>
          <div className="space-y-4">
            {roomCosts.map((room, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{room.name}</h4>
                  <span className="text-lg font-bold text-gray-800">${room.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{room.items} items</span>
                  <span>${Math.round(room.cost / room.items)} avg/item</span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(room.cost / totalCost) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Items Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Detailed Item List</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedCategory('furniture')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'furniture' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Furniture Only
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Item</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800">Room</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">Unit Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: 'Modern Sectional Sofa', category: 'Furniture', room: 'Living Room', qty: 1, unit: 2800, total: 2800 },
                { item: 'Glass Coffee Table', category: 'Furniture', room: 'Living Room', qty: 1, unit: 650, total: 650 },
                { item: 'Floor Lamp Set', category: 'Lighting', room: 'Living Room', qty: 2, unit: 180, total: 360 },
                { item: 'Area Rug', category: 'Decor', room: 'Living Room', qty: 1, unit: 420, total: 420 },
                { item: 'Platform Bed', category: 'Furniture', room: 'Bedroom', qty: 1, unit: 1200, total: 1200 },
                { item: 'Nightstands', category: 'Furniture', room: 'Bedroom', qty: 2, unit: 280, total: 560 },
              ].map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{item.item}</td>
                  <td className="py-3 px-4 text-gray-600">{item.category}</td>
                  <td className="py-3 px-4 text-gray-600">{item.room}</td>
                  <td className="py-3 px-4 text-right text-gray-600">{item.qty}</td>
                  <td className="py-3 px-4 text-right text-gray-600">${item.unit}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800">${item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;