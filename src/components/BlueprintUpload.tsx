import React, { useState, useCallback } from 'react';
import { Upload, FileText, Check, Loader, Wand2, Image } from 'lucide-react';

interface BlueprintUploadProps {
  onBlueprintUpload: (file: string) => void;
  onDesignGenerate: (design: any) => void;
  onNavigate: (view: string) => void;
}

const BlueprintUpload: React.FC<BlueprintUploadProps> = ({ 
  onBlueprintUpload, 
  onDesignGenerate, 
  onNavigate 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image/') || file.type.includes('pdf')) {
        setUploadedFile(file);
        setStep(2);
        const reader = new FileReader();
        reader.onload = () => {
          onBlueprintUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onBlueprintUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setStep(2);
      const reader = new FileReader();
      reader.onload = () => {
        onBlueprintUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDesign = async () => {
    setProcessing(true);
    setStep(3);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated design data
    const mockDesign = {
      id: Date.now(),
      rooms: [
        { name: 'Living Room', area: 250, style: 'Modern', furniture: ['Sofa', 'Coffee Table', 'TV Unit'] },
        { name: 'Bedroom', area: 180, style: 'Minimalist', furniture: ['Bed', 'Wardrobe', 'Nightstand'] },
        { name: 'Kitchen', area: 120, style: 'Contemporary', furniture: ['Island', 'Cabinets', 'Dining Table'] }
      ],
      totalCost: 25000,
      timeline: '4-6 weeks'
    };
    
    onDesignGenerate(mockDesign);
    setProcessing(false);
    setStep(4);
  };

  const steps = [
    { number: 1, title: 'Upload Blueprint', status: step >= 1 ? 'completed' : 'pending' },
    { number: 2, title: 'Review Details', status: step >= 2 ? 'completed' : 'pending' },
    { number: 3, title: 'AI Processing', status: step >= 3 ? 'completed' : 'pending' },
    { number: 4, title: 'Design Ready', status: step >= 4 ? 'completed' : 'pending' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                stepItem.status === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : step === stepItem.number 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {stepItem.status === 'completed' ? <Check className="w-5 h-5" /> : stepItem.number}
              </div>
              <span className={`ml-3 font-medium ${
                stepItem.status === 'completed' || step === stepItem.number 
                  ? 'text-gray-800' 
                  : 'text-gray-500'
              }`}>
                {stepItem.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  stepItem.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Your Blueprint</h2>
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Drop your blueprint here, or click to browse
            </h3>
            <p className="text-gray-500 mb-6">
              Support for PDF, JPG, PNG files up to 10MB
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer inline-block transform hover:scale-105 transition-all duration-200"
            >
              Choose File
            </label>
          </div>
        </div>
      )}

      {step === 2 && uploadedFile && (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Blueprint Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <p className="text-center font-medium">{uploadedFile.name}</p>
                <p className="text-center text-gray-500 text-sm">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Dream Home"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Office</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Style Preference
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Modern</option>
                  <option>Contemporary</option>
                  <option>Traditional</option>
                  <option>Minimalist</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={generateDesign}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Wand2 className="w-5 h-5" />
              <span>Generate AI Design</span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && processing && (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <div className="animate-spin mx-auto mb-6">
            <Loader className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI is Creating Your Design</h2>
          <p className="text-gray-600 mb-8">
            Our advanced AI is analyzing your blueprint and generating a stunning interior design...
          </p>
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
        </div>
      )}

      {step === 4 && !processing && (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Design Generated Successfully!</h2>
            <p className="text-gray-600">Your AI-powered interior design is ready to explore</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Design Summary</h3>
              <p className="text-gray-600 text-sm">3 rooms designed with modern aesthetic, estimated cost $25,000</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Timeline</h3>
              <p className="text-gray-600 text-sm">Complete renovation in 4-6 weeks with our recommended contractors</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('viewer')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Image className="w-5 h-5" />
              <span>View 3D Model</span>
            </button>
            <button
              onClick={() => onNavigate('cost')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
            >
              View Cost Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintUpload;