import React, { useState } from 'react';
import { PawPrint, Bird, TreePine, Flower2, Mountain, LayoutGrid, Search } from 'lucide-react';
import floraFaunaData from '../data/florafauna.json';
import KnowledgeLayout from './KnowledgeLayout';

interface FloraFaunaKnowledgeProps {
  onBack: () => void;
}

type Tab = 'all' | 'parks' | 'birds' | 'animals' | 'trees' | 'plants';

const FloraFaunaKnowledge: React.FC<FloraFaunaKnowledgeProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const statesData = (floraFaunaData as any).indian_biodiversity.states;

  const filteredStates = Object.entries(statesData).filter(([stateName, _]) => 
    stateName.toLowerCase().replace(/_/g, ' ').includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'all', label: 'All', icon: LayoutGrid, color: 'text-gray-600', activeColor: 'bg-gray-100 text-gray-900' },
    { id: 'parks', label: 'National Parks', icon: Mountain, color: 'text-emerald-600', activeColor: 'bg-emerald-100 text-emerald-900' },
    { id: 'birds', label: 'Birds', icon: Bird, color: 'text-sky-600', activeColor: 'bg-sky-100 text-sky-900' },
    { id: 'animals', label: 'Animals', icon: PawPrint, color: 'text-orange-600', activeColor: 'bg-orange-100 text-orange-900' },
    { id: 'trees', label: 'Trees', icon: TreePine, color: 'text-green-600', activeColor: 'bg-green-100 text-green-900' },
    { id: 'plants', label: 'Plants', icon: Flower2, color: 'text-rose-600', activeColor: 'bg-rose-100 text-rose-900' },
  ];

  const headerActions = (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search states..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-gray-100 focus:border-emerald-500 outline-none transition-all font-medium"
      />
    </div>
  );

  return (
    <KnowledgeLayout 
      onBack={onBack} 
      title="Flora & Fauna" 
      headerActions={headerActions}
    >
      <div className="flex flex-wrap gap-2 mb-12 justify-center md:justify-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border-2 ${
                isActive 
                  ? `${tab.activeColor} border-transparent` 
                  : `bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50`
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'currentColor' : tab.color}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-16">
        {filteredStates.map(([stateName, data]: [string, any]) => (
          <div key={stateName} className="space-y-8">
            <h2 className="text-3xl font-bold text-emerald-900 border-b-4 border-emerald-100 pb-4 inline-block pr-12">
              {stateName.replace(/_/g, ' ')}
            </h2>
            
            <div className="grid grid-cols-1 gap-8">
              {(activeTab === 'all' || activeTab === 'animals') && (
                <div className="space-y-6">
                  {data.state_animal && (
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-center gap-3 mb-3 text-emerald-800">
                        <PawPrint className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-xs tracking-wider">State Animal</h3>
                      </div>
                      <p className="font-bold text-lg mb-1">{data.state_animal.name}</p>
                      <p className="text-xs text-emerald-600 italic mb-3">{data.state_animal.scientific_name}</p>
                      <p className="text-sm text-emerald-700 leading-relaxed">{data.state_animal.funfact}</p>
                    </div>
                  )}
                  
                  {data.notable_wildlife && data.notable_wildlife.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <PawPrint className="w-6 h-6 text-orange-500" />
                        Notable Wildlife
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.notable_wildlife.map((animal: any, idx: number) => (
                          <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0 md:border-0 md:pb-0 md:bg-gray-50 md:p-4 md:rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-lg">{animal.name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                animal.status?.includes('Endangered') ? 'bg-red-100 text-red-700' :
                                animal.status?.includes('Vulnerable') ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {animal.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 italic">{animal.scientific_name}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {animal.funfact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'birds') && (
                <div className="space-y-6">
                  {data.state_bird && (
                    <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100">
                      <div className="flex items-center gap-3 mb-3 text-sky-800">
                        <Bird className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-xs tracking-wider">State Bird</h3>
                      </div>
                      <p className="font-bold text-lg mb-1">{data.state_bird.name}</p>
                      <p className="text-xs text-sky-600 italic mb-3">{data.state_bird.scientific_name}</p>
                      <p className="text-sm text-sky-700 leading-relaxed">{data.state_bird.funfact}</p>
                    </div>
                  )}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'trees') && data.state_tree && (
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center gap-3 mb-3 text-green-800">
                    <TreePine className="w-5 h-5" />
                    <h3 className="font-bold uppercase text-xs tracking-wider">State Tree</h3>
                  </div>
                  <p className="font-bold text-lg mb-1">{data.state_tree.name}</p>
                  <p className="text-xs text-green-600 italic mb-3">{data.state_tree.scientific_name}</p>
                  <p className="text-sm text-green-700 leading-relaxed">{data.state_tree.funfact}</p>
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'plants') && (
                <div className="space-y-6">
                  {data.state_flower && (
                    <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                      <div className="flex items-center gap-3 mb-3 text-rose-800">
                        <Flower2 className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-xs tracking-wider">State Flower</h3>
                      </div>
                      <p className="font-bold text-lg mb-1">{data.state_flower.name}</p>
                      <p className="text-xs text-rose-600 italic mb-3">{data.state_flower.scientific_name}</p>
                      <p className="text-sm text-rose-700 leading-relaxed">{data.state_flower.funfact}</p>
                    </div>
                  )}
                  {data.unique_flora && data.unique_flora.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Flower2 className="w-6 h-6 text-rose-500" />
                        Unique Flora
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.unique_flora.map((flora: any, idx: number) => (
                          <div key={idx} className="bg-rose-50/30 p-4 rounded-xl border border-rose-100">
                            <h4 className="font-bold text-lg mb-1">{flora.name}</h4>
                            <p className="text-xs text-gray-500 italic mb-2">{flora.scientific_name}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {flora.funfact}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'parks') && data.national_parks && data.national_parks.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Mountain className="w-6 h-6 text-emerald-500" />
                    National Parks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.national_parks.map((park: any, idx: number) => (
                      <div key={idx} className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100 h-full">
                        <h4 className="font-bold text-lg mb-1">{park.name}</h4>
                        <div className="flex gap-4 text-xs text-gray-500 mb-3">
                          <span>Est. {park.established}</span>
                          <span>{park.area_sq_km} sq km</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                          {park.funfact}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {park.key_species?.split(',').map((species: string, sIdx: number) => (
                            <span key={sIdx} className="text-xs bg-white border border-emerald-100 text-emerald-700 px-2 py-1 rounded-md shadow-sm">
                              {species.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredStates.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No states found</h3>
            <p className="text-gray-500">Try searching for a different state.</p>
          </div>
        )}
      </div>
    </KnowledgeLayout>
  );
};

export default FloraFaunaKnowledge;
