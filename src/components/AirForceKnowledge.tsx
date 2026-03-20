import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Plane, History, Award, Info, Rocket } from 'lucide-react';
import airforceData from '../data/airforce.json';
import KnowledgeLayout from './KnowledgeLayout';

interface AirForceKnowledgeProps {
  onBack: () => void;
}

type Section = 'aircraft' | 'history' | 'commands' | 'facts' | 'weapons';

const AirForceKnowledge: React.FC<AirForceKnowledgeProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<Section>('aircraft');
  const [searchTerm, setSearchTerm] = useState('');

  const data = airforceData.indian_air_force;

  const renderAircraft = () => {
    const aircraftCategories = data.aircraft.currently_active;
    return (
      <div className="space-y-12">
        {Object.entries(aircraftCategories).map(([category, list]) => (
          <div key={category}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 capitalize border-b-2 border-gray-100 pb-2">
              {category.replace(/_/g, ' ')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(list as any[]).filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.role.some((r: string) => r.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((aircraft: any) => (
                <div
                  key={aircraft.name}
                  className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all border-2 border-gray-100 hover:border-blue-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                      {aircraft.origin}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">{aircraft.introduced}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{aircraft.name}</h4>
                  <p className="text-sm text-gray-500 mb-4">{aircraft.type}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {aircraft.role.slice(0, 3).map((role: string) => (
                      <span key={role} className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                        {role}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex gap-2 items-start">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 italic leading-relaxed">
                        "{aircraft.funfact}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeapons = () => {
    // @ts-ignore
    const weaponsData = data.missiles_and_weapons;
    if (!weaponsData) return null;

    return (
      <div className="space-y-12">
        {Object.entries(weaponsData).map(([category, list]) => (
          <div key={category}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 capitalize border-b-2 border-gray-100 pb-2">
              {category.replace(/_/g, ' ')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(list as any[]).filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.platform && item.platform.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((weapon: any) => (
                <div
                  key={weapon.name}
                  className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all border-2 border-gray-100 hover:border-red-100 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                      {weapon.origin}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">{weapon.type}</span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{weapon.name}</h4>
                  
                  <div className="mb-4 space-y-1">
                    {weapon.range && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Range:</span> {weapon.range}
                      </p>
                    )}
                    {weapon.speed && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Speed:</span> {weapon.speed}
                      </p>
                    )}
                    {weapon.platform && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Platform:</span> {weapon.platform}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex gap-2 items-start">
                      <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 italic leading-relaxed">
                        "{weapon.funfact}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-8">
      {data.historic_operations.map((op: any) => (
        <div
          key={op.name}
          className="bg-white rounded-[2rem] p-8 shadow-sm border-2 border-gray-100 flex flex-col md:flex-row gap-6 items-start"
        >
          <div className="bg-orange-50 text-orange-600 font-bold text-xl px-6 py-4 rounded-2xl shrink-0">
            {op.year}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{op.name}</h3>
            <p className="text-gray-600 mb-4 text-lg">{op.description}</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <span className="font-bold text-gray-700 block mb-1">Key Aircraft:</span>
              <div className="flex flex-wrap gap-2">
                {op.aircraft_used.map((ac: string) => (
                  <span key={ac} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-600">
                    {ac}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500 italic border-l-4 border-orange-200 pl-4">
              {op.funfact}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCommands = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.commands.map((cmd: any) => (
        <div
          key={cmd.name}
          className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-gray-100 hover:border-green-100 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{cmd.name}</h3>
              <p className="text-sm text-gray-500">{cmd.headquarters}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold">Area:</span> {cmd.area_of_responsibility}
          </p>
        </div>
      ))}
    </div>
  );

  const renderFacts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" /> General Facts
        </h3>
        <ul className="space-y-4">
          {Object.entries(data.general_facts).map(([key, value]) => (
            <li key={key} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
              <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="font-bold text-gray-900 text-right">
                {Array.isArray(value) ? value.length : value}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border-2 border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Motto & Origin</h3>
        <blockquote className="text-2xl font-serif italic text-gray-800 mb-4 text-center">
          "{data.metadata.motto}"
        </blockquote>
        <p className="text-center text-gray-500 text-sm">
          Origin: {data.metadata.motto_origin}
        </p>
        <div className="mt-8 p-4 bg-orange-50 rounded-xl text-center">
          <p className="text-orange-800 font-bold">Founded: {data.metadata.founded}</p>
        </div>
      </div>
    </div>
  );

  const headerActions = (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
      {[
        { id: 'aircraft', label: 'Aircraft', icon: Plane },
        { id: 'weapons', label: 'Weapons', icon: Rocket },
        { id: 'history', label: 'History', icon: History },
        { id: 'commands', label: 'Commands', icon: Shield },
        { id: 'facts', label: 'Facts', icon: Award },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveSection(tab.id as Section)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeSection === tab.id 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <tab.icon className="w-4 h-4" /> {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <KnowledgeLayout 
      onBack={onBack} 
      title="Indian Air Force" 
      headerActions={headerActions}
    >
      {(activeSection === 'aircraft' || activeSection === 'weapons') && (
        <div className="mb-8 relative max-w-md mx-auto md:mx-0">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeSection}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-gray-100 focus:border-black outline-none transition-all font-medium"
          />
        </div>
      )}

      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'aircraft' && renderAircraft()}
        {activeSection === 'weapons' && renderWeapons()}
        {activeSection === 'history' && renderHistory()}
        {activeSection === 'commands' && renderCommands()}
        {activeSection === 'facts' && renderFacts()}
      </motion.div>
    </KnowledgeLayout>
  );
};

export default AirForceKnowledge;
