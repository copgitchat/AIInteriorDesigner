import React, { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move, Palette, Download, Share } from 'lucide-react';
import Scene3D from './Scene3D';

interface DesignViewerProps {
  blueprint?: string | null;
  design?: any;
}

const DesignViewer: React.FC<DesignViewerProps> = ({ blueprint, design }) => {
  const [selectedRoom, setSelectedRoom] = useState('living-room');
  const [viewMode, setViewMode] = useState('3d');

  const rooms = [
    { id: 'living-room', name: 'Living Room', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg' },
    { id: 'bedroom', name: 'Master Bedroom', image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg' },
    { id: 'kitchen', name: 'Kitchen', image: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg' },
    { id: 'bathroom', name: 'Bathroom', image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg' },
  ];

  const viewerControls = [
    { icon: RotateCcw, label: 'Reset View', action: () => {} },
    { icon: ZoomIn, label: 'Zoom In', action: () => {} },
    { icon: ZoomOut, label: 'Zoom Out', action: () => {} },
    { icon: Move, label: 'Pan', action: () => {} },
  ];

  const currentRoom = rooms.find(room => room.id === selectedRoom);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">3D Design Viewer</h2>
            <p className="text-gray-600">Explore your AI-generated interior design</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === '3d' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setViewMode('floor-plan')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'floor-plan' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                }`}
              >
                Floor Plan
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Room Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rooms</h3>
            <div className="space-y-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedRoom === room.id
                      ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {room.name.charAt(0)}
                    </div>
                    <span className="font-medium">{room.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative">
              {/* Mock 3D Viewer */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <Scene3D 
                  selectedRoom={selectedRoom}
                  onObjectClick={(object) => {
                    console.log('Clicked object:', object);
                  }}
                />
              </div>

              {/* Room Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{currentRoom?.name}</h3>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium">
                    <Palette className="w-4 h-4" />
                    <span>Customize</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">250</p>
                    <p className="text-gray-500 text-sm">Sq Ft</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">$8,500</p>
                    <p className="text-gray-500 text-sm">Est. Cost</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">12</p>
                    <p className="text-gray-500 text-sm">Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">Modern</p>
                    <p className="text-gray-500 text-sm">Style</p>
                  </div>
                </div>

                {/* Furniture List */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Furniture & Decor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Modern Sectional Sofa', 'Glass Coffee Table', 'Floor Lamp', 'Wall Art Set', 'Area Rug', 'Side Tables'].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item}</span>
                        <span className="text-green-600 font-medium">${(Math.random() * 2000 + 200).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignViewer;