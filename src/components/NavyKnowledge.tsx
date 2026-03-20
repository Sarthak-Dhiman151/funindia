import React, { useState, useMemo, useDeferredValue } from 'react';
import { Search, Anchor, Ship, Crosshair, Shield, History, Info, LayoutGrid, Plane, Rocket, Zap, Lightbulb } from 'lucide-react';
import navyData from '../data/indianNavy.json';
import KnowledgeLayout from './KnowledgeLayout';

interface NavyKnowledgeProps {
  onBack: () => void;
}

type Tab = 'all' | 'ships' | 'submarines' | 'aircraft' | 'weapons' | 'history' | 'special_forces' | 'future' | 'trivia';

const NavyKnowledge: React.FC<NavyKnowledgeProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const data = navyData.indian_navy;

  const tabs = useMemo(() => [
    { id: 'all', label: 'All', icon: LayoutGrid, color: 'text-gray-600', activeColor: 'bg-gray-100 text-gray-900' },
    { id: 'ships', label: 'Ships', icon: Ship, color: 'text-blue-600', activeColor: 'bg-blue-100 text-blue-900' },
    { id: 'submarines', label: 'Submarines', icon: Anchor, color: 'text-indigo-600', activeColor: 'bg-indigo-100 text-indigo-900' },
    { id: 'aircraft', label: 'Aircraft', icon: Plane, color: 'text-sky-600', activeColor: 'bg-sky-100 text-sky-900' },
    { id: 'weapons', label: 'Weapons', icon: Rocket, color: 'text-red-500', activeColor: 'bg-red-100 text-red-900' },
    { id: 'special_forces', label: 'Special Forces', icon: Shield, color: 'text-emerald-600', activeColor: 'bg-emerald-100 text-emerald-900' },
    { id: 'history', label: 'History', icon: History, color: 'text-orange-600', activeColor: 'bg-orange-100 text-orange-900' },
    { id: 'future', label: 'Future', icon: Zap, color: 'text-purple-600', activeColor: 'bg-purple-100 text-purple-900' },
    { id: 'trivia', label: 'Trivia', icon: Lightbulb, color: 'text-yellow-500', activeColor: 'bg-yellow-100 text-yellow-900' },
  ], []);

  // Filter logic
  const filterItem = (item: any) => {
    if (!deferredSearch) return true;
    const searchLower = deferredSearch.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.class?.toLowerCase().includes(searchLower) ||
      item.funfact?.toLowerCase().includes(searchLower) ||
      item.type?.toLowerCase().includes(searchLower)
    );
  };

  const filteredData = useMemo(() => {
    return {
      aircraft_carriers: data.vessels.aircraft_carriers.filter(filterItem),
      destroyers: data.vessels.destroyers.active.filter(filterItem),
      frigates: data.vessels.frigates.active.filter(filterItem),
      nuclear_subs: data.vessels.submarines.nuclear_submarines.ssbn_ballistic_missile.filter((s: any) => s.status === 'Active' && filterItem(s)),
      conventional_subs: data.vessels.submarines.conventional_submarines.diesel_electric.filter(filterItem),
      fixed_wing: data.naval_aviation.fixed_wing_aircraft.filter(filterItem),
      helicopters: data.naval_aviation.rotary_wing_aircraft.filter(filterItem),
      uavs: data.naval_aviation.unmanned_aerial_vehicles.filter(filterItem),
      anti_ship: data.missiles_and_weapons.anti_ship_missiles.filter(filterItem),
      sams: data.missiles_and_weapons.surface_to_air_missiles.filter(filterItem),
      torpedoes: data.missiles_and_weapons.torpedoes.filter(filterItem),
      operations: data.historic_operations.filter(filterItem),
      future_construction: data.future_projects.under_construction.filter(filterItem),
      future_planned: data.future_projects.planned_acquisitions.filter(filterItem),
      facts: data.fun_facts_and_records.filter((f: any) => 
        !deferredSearch || 
        f.fact.toLowerCase().includes(deferredSearch.toLowerCase()) || 
        f.funfact.toLowerCase().includes(deferredSearch.toLowerCase())
      ),
    };
  }, [deferredSearch, data]);

  const headerActions = (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search navy facts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-gray-100 focus:border-blue-500 outline-none transition-all font-medium"
      />
    </div>
  );

  return (
    <KnowledgeLayout 
      onBack={onBack} 
      title="Indian Navy" 
      headerActions={headerActions}
    >
      <HeroSection data={data.metadata} />

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

      <div className="space-y-12 min-h-[500px]">
        {(activeTab === 'all' || activeTab === 'ships') && (
          <Section title="Fleet" color="blue">
            {filteredData.aircraft_carriers.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                  <Ship className="w-6 h-6" /> Aircraft Carriers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredData.aircraft_carriers.map((ship: any, idx: number) => (
                    <ShipCard key={idx} ship={ship} color="blue" />
                  ))}
                </div>
              </div>
            )}

            {filteredData.destroyers.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                  <Crosshair className="w-6 h-6" /> Destroyers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.destroyers.map((ship: any, idx: number) => (
                    <ShipCard key={idx} ship={ship} color="gray" compact />
                  ))}
                </div>
              </div>
            )}

            {filteredData.frigates.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                  <Shield className="w-6 h-6" /> Frigates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.frigates.slice(0, 6).map((ship: any, idx: number) => (
                    <ShipCard key={idx} ship={ship} color="gray" compact />
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {(activeTab === 'all' || activeTab === 'submarines') && (
          <Section title="Submarines" color="indigo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.nuclear_subs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-800">Nuclear Powered (SSBN)</h3>
                  {filteredData.nuclear_subs.map((sub: any, idx: number) => (
                    <div key={idx} className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-indigo-900">{sub.name}</h4>
                        <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded-full font-bold">Nuclear</span>
                      </div>
                      <p className="text-sm text-indigo-700 mb-3">{sub.type}</p>
                      <p className="text-sm text-indigo-800 italic">"{sub.funfact}"</p>
                    </div>
                  ))}
                </div>
              )}

              {filteredData.conventional_subs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-700">Conventional (Diesel-Electric)</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredData.conventional_subs.slice(0, 4).map((sub: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{sub.name}</h4>
                          <span className="text-xs font-mono text-gray-500">{sub.class}</span>
                        </div>
                        <p className="text-sm text-gray-600">{sub.funfact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {(activeTab === 'all' || activeTab === 'aircraft') && (
          <Section title="Naval Aviation" color="sky">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.fixed_wing.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-sky-800 mb-4 flex items-center gap-2">
                    <Plane className="w-5 h-5" /> Fixed Wing
                  </h3>
                  <div className="space-y-4">
                    {filteredData.fixed_wing.map((aircraft: any, idx: number) => (
                      <div key={idx} className="bg-sky-50 rounded-xl p-5 border border-sky-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sky-900">{aircraft.name}</h4>
                          <span className="text-xs bg-sky-200 text-sky-800 px-2 py-1 rounded-full">{aircraft.origin}</span>
                        </div>
                        <p className="text-sm text-sky-700 mb-2">{aircraft.type}</p>
                        <p className="text-sm text-sky-800 italic">"{aircraft.funfact}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {filteredData.helicopters.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-sky-800 mb-4 flex items-center gap-2">
                      <Crosshair className="w-5 h-5" /> Helicopters
                    </h3>
                    <div className="space-y-4">
                      {filteredData.helicopters.slice(0, 3).map((heli: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{heli.name}</h4>
                            <span className="text-xs text-gray-500">{heli.role[0]}</span>
                          </div>
                          <p className="text-sm text-gray-600">{heli.funfact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredData.uavs.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-sky-800 mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5" /> UAVs
                    </h3>
                    <div className="space-y-4">
                      {filteredData.uavs.slice(0, 2).map((uav: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-xl p-5 border-2 border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{uav.name}</h4>
                            <span className="text-xs text-gray-500">{uav.type}</span>
                          </div>
                          <p className="text-sm text-gray-600">{uav.funfact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {(activeTab === 'all' || activeTab === 'weapons') && (
          <Section title="Missiles & Weapons" color="red">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredData.anti_ship.length > 0 && (
                <WeaponCategory title="Anti-Ship Missiles" items={filteredData.anti_ship} color="red" />
              )}
              {filteredData.sams.length > 0 && (
                <WeaponCategory title="Air Defense" items={filteredData.sams} color="orange" />
              )}
              {filteredData.torpedoes.length > 0 && (
                <WeaponCategory title="Torpedoes" items={filteredData.torpedoes} color="blue" />
              )}
            </div>
          </Section>
        )}

        {(activeTab === 'all' || activeTab === 'special_forces') && (
          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="w-10 h-10 text-emerald-500" />
              <div>
                <h2 className="text-3xl font-bold">{data.special_forces.marcos.name}</h2>
                <p className="text-gray-400 italic">"{data.special_forces.marcos.motto}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-4">About MARCOS</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {data.special_forces.marcos.funfact}
                </p>
                <div className="space-y-2">
                  <p><span className="text-gray-500">Selection Rate:</span> {data.special_forces.marcos.selection_rate}</p>
                  <p><span className="text-gray-500">Training:</span> {data.special_forces.marcos.training_duration}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Notable Operations</h3>
                <div className="space-y-4">
                  {data.special_forces.marcos.notable_operations.slice(0, 3).map((op: any, idx: number) => (
                    <div key={idx} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">{op.name}</span>
                        <span className="text-sm text-gray-500">{op.year}</span>
                      </div>
                      <p className="text-sm text-gray-400">{op.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'history') && filteredData.operations.length > 0 && (
          <Section title="Historic Operations" color="orange">
            <div className="relative border-l-4 border-orange-200 ml-4 space-y-12 py-4">
              {filteredData.operations.slice(0, 5).map((op: any, idx: number) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute -left-[13px] top-0 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-sm"></div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                    <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{op.name}</h3>
                      <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-bold">{op.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 font-medium">{op.location}</p>
                    <p className="text-gray-700 mb-4">{op.result}</p>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <p className="text-sm text-orange-800 italic flex gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        {op.funfact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {(activeTab === 'all' || activeTab === 'future') && (
          <Section title="Future Projects" color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredData.future_construction.length > 0 && (
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Under Construction</h3>
                  <div className="space-y-4">
                    {filteredData.future_construction.slice(0, 3).map((project: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold text-purple-900">{project.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">{project.funfact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredData.future_planned.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border-2 border-purple-100">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Planned Acquisitions</h3>
                  <div className="space-y-4">
                    {filteredData.future_planned.slice(0, 3).map((project: any, idx: number) => (
                      <div key={idx} className="bg-purple-50 rounded-xl p-4 shadow-sm">
                        <h4 className="font-bold text-purple-900">{project.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">{project.funfact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {(activeTab === 'all' || activeTab === 'trivia') && filteredData.facts.length > 0 && (
          <Section title="Fun Facts & Records" color="yellow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.facts.map((fact: any, idx: number) => (
                <div key={idx} className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-6 h-6 text-yellow-600 shrink-0" />
                    <h3 className="font-bold text-yellow-900">{fact.fact}</h3>
                  </div>
                  <p className="text-sm text-yellow-800 italic">{fact.funfact}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </KnowledgeLayout>
  );
};

// Memoized Sub-components
const HeroSection = React.memo(({ data }: { data: any }) => (
  <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 mb-12 text-white shadow-xl relative overflow-hidden">
    <div className="relative z-10">
      <h1 className="text-4xl font-bold mb-4">{data.official_name}</h1>
      <p className="text-blue-100 text-lg mb-6 max-w-2xl">{data.motto} - "{data.motto_origin}"</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-blue-300 text-sm uppercase tracking-wider font-bold">Founded</p>
          <p className="font-bold text-lg">{data.founded}</p>
        </div>
        <div>
          <p className="text-blue-300 text-sm uppercase tracking-wider font-bold">Navy Day</p>
          <p className="font-bold text-lg">{data.navy_day}</p>
        </div>
        <div>
          <p className="text-blue-300 text-sm uppercase tracking-wider font-bold">Headquarters</p>
          <p className="font-bold text-lg">{data.headquarters}</p>
        </div>
        <div>
          <p className="text-blue-300 text-sm uppercase tracking-wider font-bold">Commander</p>
          <p className="font-bold text-lg">{data.supreme_commander}</p>
        </div>
      </div>
    </div>
    <Anchor className="absolute -right-10 -bottom-10 w-64 h-64 text-blue-800 opacity-50 rotate-12" />
  </div>
));

const Section = React.memo(({ title, color, children }: { title: string, color: string, children: React.ReactNode }) => (
  <div className="space-y-8">
    <h2 className={`text-3xl font-bold text-${color}-900 border-b-4 border-${color}-100 pb-4 inline-block pr-12`}>
      {title}
    </h2>
    {children}
  </div>
));

const ShipCard = React.memo(({ ship, color, compact }: { ship: any, color: string, compact?: boolean }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-${color}-200 transition-all`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className={`font-bold ${compact ? 'text-lg' : 'text-xl'} text-${color}-900`}>{ship.name}</h4>
        <p className={`text-${compact ? 'xs' : 'sm'} text-gray-500 font-mono`}>{ship.pennant_number}</p>
      </div>
      {!compact && <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded-full font-bold`}>Active</span>}
    </div>
    <div className={`space-y-2 mb-4 text-sm text-gray-600 ${compact ? 'hidden' : ''}`}>
      <p><span className="font-semibold">Class:</span> {ship.class}</p>
      <p><span className="font-semibold">Origin:</span> {ship.origin}</p>
      <p><span className="font-semibold">Commissioned:</span> {ship.commissioned}</p>
    </div>
    {compact && <p className="text-sm text-gray-600 mb-3"><span className="font-semibold">Class:</span> {ship.class}</p>}
    <div className={`bg-${color === 'blue' ? 'blue' : 'gray'}-50 p-${compact ? '3' : '4'} rounded-xl`}>
      <p className={`text-${compact ? 'xs' : 'sm'} text-${color === 'blue' ? 'blue' : 'gray'}-800 italic`}>"{ship.funfact}"</p>
    </div>
  </div>
));

const WeaponCategory = React.memo(({ title, items, color }: { title: string, items: any[], color: string }) => (
  <div className={`bg-${color}-50 rounded-2xl p-6 border border-${color}-100`}>
    <h3 className={`text-xl font-bold text-${color}-800 mb-4`}>{title}</h3>
    <div className="space-y-4">
      {items.slice(0, 3).map((item: any, idx: number) => (
        <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
          <h4 className={`font-bold text-${color}-900`}>{item.name}</h4>
          <p className={`text-xs text-${color}-600 mb-2`}>{item.type}</p>
          <p className="text-sm text-gray-600">{item.funfact}</p>
        </div>
      ))}
    </div>
  </div>
));

export default NavyKnowledge;
