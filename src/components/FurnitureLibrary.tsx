import React from 'react';
import { Sofa, Bed, ChefHat, Bath, Lamp, Table, Armchair as Chair, Tv } from 'lucide-react';

interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: React.ComponentType<any>;
  modelUrl?: string;
  description: string;
}

interface FurnitureLibraryProps {
  selectedRoom: string;
  onFurnitureSelect: (furniture: FurnitureItem) => void;
}

const FurnitureLibrary: React.FC<FurnitureLibraryProps> = ({ selectedRoom, onFurnitureSelect }) => {
  const furnitureDatabase: Record<string, FurnitureItem[]> = {
    'living-room': [
      {
        id: 'modern-sofa',
        name: 'Modern Sectional Sofa',
        category: 'Seating',
        price: 2800,
        icon: Sofa,
        description: 'Contemporary L-shaped sectional with premium fabric'
      },
      {
        id: 'glass-table',
        name: 'Glass Coffee Table',
        category: 'Tables',
        price: 650,
        icon: Table,
        description: 'Tempered glass top with chrome legs'
      },
      {
        id: 'floor-lamp',
        name: 'Arc Floor Lamp',
        category: 'Lighting',
        price: 320,
        icon: Lamp,
        description: 'Adjustable arc lamp with marble base'
      },
      {
        id: 'tv-unit',
        name: 'Entertainment Center',
        category: 'Storage',
        price: 890,
        icon: Tv,
        description: 'Wall-mounted TV unit with hidden storage'
      }
    ],
    'bedroom': [
      {
        id: 'platform-bed',
        name: 'Platform Bed',
        category: 'Furniture',
        price: 1200,
        icon: Bed,
        description: 'Minimalist platform bed with built-in nightstands'
      },
      {
        id: 'wardrobe',
        name: 'Walk-in Wardrobe',
        category: 'Storage',
        price: 2400,
        icon: Chair,
        description: 'Custom wardrobe system with sliding doors'
      },
      {
        id: 'bedside-lamp',
        name: 'Bedside Table Lamp',
        category: 'Lighting',
        price: 180,
        icon: Lamp,
        description: 'Touch-sensitive LED table lamp'
      }
    ],
    'kitchen': [
      {
        id: 'kitchen-island',
        name: 'Kitchen Island',
        category: 'Furniture',
        price: 3200,
        icon: ChefHat,
        description: 'Multi-functional island with storage and seating'
      },
      {
        id: 'dining-set',
        name: 'Dining Table Set',
        category: 'Dining',
        price: 1800,
        icon: Table,
        description: '6-seater dining table with matching chairs'
      }
    ],
    'bathroom': [
      {
        id: 'vanity-unit',
        name: 'Floating Vanity',
        category: 'Fixtures',
        price: 950,
        icon: Bath,
        description: 'Wall-mounted vanity with integrated sink'
      },
      {
        id: 'shower-system',
        name: 'Rain Shower System',
        category: 'Fixtures',
        price: 1200,
        icon: Bath,
        description: 'Thermostatic shower with rainfall head'
      }
    ]
  };

  const currentFurniture = furnitureDatabase[selectedRoom] || [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Furniture Library</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {currentFurniture.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onFurnitureSelect(item)}
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{item.category}</span>
                  <span className="font-semibold text-green-600">${item.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FurnitureLibrary;