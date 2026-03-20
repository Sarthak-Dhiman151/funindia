import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Info } from 'lucide-react';
import airportData from '../data/airports.json';
import KnowledgeLayout from './KnowledgeLayout';

interface AirportKnowledgeProps {
  onBack: () => void;
}

const AirportKnowledge: React.FC<AirportKnowledgeProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const data = airportData.indian_airports_funfacts;
  const allStates = { ...data.states, ...data.union_territories };

  const filteredStates = Object.entries(allStates).reduce((acc, [stateName, stateData]) => {
    const filteredAirports = stateData.airports.filter((airport: any) => 
      airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredAirports.length > 0) {
      acc[stateName] = { airports: filteredAirports };
    }
    return acc;
  }, {} as Record<string, any>);

  const headerActions = (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search airports, cities, or codes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-gray-100 focus:border-black outline-none transition-all font-medium"
      />
    </div>
  );

  return (
    <KnowledgeLayout 
      onBack={onBack} 
      title="Indian Airports" 
      headerActions={headerActions}
    >
      <div className="space-y-16">
        {Object.entries(filteredStates).map(([stateName, stateData]) => (
          <div key={stateName} className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-gray-100 pb-4 inline-block pr-12">
              {stateName}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stateData.airports.map((airport: any) => (
                <div 
                  key={airport.iata_code}
                  className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all border-2 border-gray-100 hover:border-gray-200 flex flex-col h-full group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-black text-white font-mono font-bold px-4 py-2 rounded-xl text-sm tracking-wider group-hover:bg-fun-accent transition-colors">
                      {airport.iata_code}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 font-medium text-sm bg-gray-50 px-3 py-1 rounded-lg">
                      <MapPin className="w-4 h-4" />
                      {airport.city}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {airport.name}
                  </h3>
                  
                  <div className="mt-auto pt-6 border-t-2 border-gray-50">
                    <div className="flex gap-3 items-start">
                      <Info className="w-5 h-5 text-fun-blue shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {airport.funfact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(filteredStates).length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No airports found</h3>
            <p className="text-gray-500">Try searching for a different city or code.</p>
          </div>
        )}
      </div>
    </KnowledgeLayout>
  );
};

export default AirportKnowledge;
