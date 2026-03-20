import React, { useState, useMemo, useDeferredValue } from 'react';
import { Search, Mountain, Map, Info, Compass, Sunrise, CloudRain, Trees, Snowflake } from 'lucide-react';
import mountainData from '../data/mountain.json';
import KnowledgeLayout from './KnowledgeLayout';

interface MountainKnowledgeProps {
  onBack: () => void;
}

type Tab = 'overview' | 'himalayas' | 'trans_himalayas' | 'central' | 'western_ghats' | 'eastern_ghats' | 'northeast';

const MountainKnowledge: React.FC<MountainKnowledgeProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const data = mountainData.indian_mountain_ranges;

  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: Info, color: 'text-blue-600', activeColor: 'bg-blue-100 text-blue-900' },
    { id: 'himalayas', label: 'Himalayas', icon: Mountain, color: 'text-indigo-600', activeColor: 'bg-indigo-100 text-indigo-900' },
    { id: 'trans_himalayas', label: 'Trans-Himalayas', icon: Snowflake, color: 'text-sky-600', activeColor: 'bg-sky-100 text-sky-900' },
    { id: 'central', label: 'Central India', icon: Map, color: 'text-orange-600', activeColor: 'bg-orange-100 text-orange-900' },
    { id: 'western_ghats', label: 'Western Ghats', icon: Trees, color: 'text-emerald-600', activeColor: 'bg-emerald-100 text-emerald-900' },
    { id: 'eastern_ghats', label: 'Eastern Ghats', icon: Sunrise, color: 'text-yellow-600', activeColor: 'bg-yellow-100 text-yellow-900' },
    { id: 'northeast', label: 'North East', icon: CloudRain, color: 'text-teal-600', activeColor: 'bg-teal-100 text-teal-900' },
  ], []);

  const filterItem = (item: any) => {
    if (!deferredSearch) return true;
    const searchLower = deferredSearch.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.funfact?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower) ||
      item.meaning?.toLowerCase().includes(searchLower)
    );
  };

  const filteredData = useMemo(() => {
    const ranges = data.major_mountain_ranges;
    
    const himalayasGroup = [ranges.the_himalayas, ranges.pir_panjal_range, ranges.dhauladhar_range];
    const transHimalayasGroup = [ranges.karakoram_range, ranges.ladakh_range, ranges.zanskar_range];
    const centralGroup = [ranges.aravalli_range, ranges.vindhya_range, ranges.satpura_range];
    const westernGhatsGroup = [ranges.western_ghats, ranges.nilgiri_hills, ranges.palani_hills, ranges.anamalai_hills, ranges.cardamom_hills];
    const easternGhatsGroup = [ranges.eastern_ghats];
    const northeastGroup = [ranges.purvanchal_range, ranges.shillong_plateau];

    const filterRange = (range: any) => {
      if (!deferredSearch) return range;
      if (filterItem(range)) return range;
      const mountains = range.famous_mountains?.filter(filterItem) || [];
      const treks = range.famous_treks?.filter(filterItem) || [];
      if (mountains.length > 0 || treks.length > 0) {
        return { ...range, famous_mountains: mountains, famous_treks: treks };
      }
      return null;
    };

    return {
      himalayas: himalayasGroup.map(filterRange).filter(Boolean),
      trans_himalayas: transHimalayasGroup.map(filterRange).filter(Boolean),
      central: centralGroup.map(filterRange).filter(Boolean),
      western_ghats: westernGhatsGroup.map(filterRange).filter(Boolean),
      eastern_ghats: easternGhatsGroup.map(filterRange).filter(Boolean),
      northeast: northeastGroup.map(filterRange).filter(Boolean),
      facts: data.interesting_facts.filter((f: any) => 
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
        placeholder="Search mountains, treks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-gray-100 focus:border-stone-500 outline-none transition-all font-medium"
      />
    </div>
  );

  return (
    <KnowledgeLayout 
      onBack={onBack} 
      title="Mountains of India" 
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <Section title="Summary Statistics" color="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Total Major Ranges" value={data.summary_statistics.total_major_ranges} />
                <StatCard label="Highest Peak" value={data.summary_statistics.highest_peak_in_india.name} subtext={data.summary_statistics.highest_peak_in_india.height} />
                <StatCard label="Longest Range" value={data.summary_statistics.longest_range_in_india} />
                <StatCard label="Oldest Range" value={data.summary_statistics.oldest_mountain_range.name} subtext={data.summary_statistics.oldest_mountain_range.age} />
                <StatCard label="Youngest Range" value={data.summary_statistics.youngest_mountain_range.name} subtext={data.summary_statistics.youngest_mountain_range.age} />
                <StatCard label="Biodiversity Hotspot" value={data.summary_statistics.most_biodiverse_range} />
              </div>
            </Section>

            <Section title="Interesting Facts" color="yellow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.facts.map((fact: any, idx: number) => (
                  <FactCard key={idx} fact={fact} color="yellow" />
                ))}
              </div>
            </Section>
          </div>
        )}

        {['himalayas', 'trans_himalayas', 'central', 'western_ghats', 'eastern_ghats', 'northeast'].includes(activeTab) && (
          <div className="space-y-12">
            {filteredData[activeTab as keyof typeof filteredData]?.map((range: any, idx: number) => (
              <RangeSection key={idx} range={range} />
            ))}
          </div>
        )}
      </div>
    </KnowledgeLayout>
  );
};

// Memoized Sub-components
const HeroSection = React.memo(({ data }: { data: any }) => (
  <div className="bg-gradient-to-r from-stone-800 to-stone-600 rounded-3xl p-8 mb-12 text-white shadow-xl relative overflow-hidden">
    <div className="relative z-10">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <p className="text-stone-100 text-lg mb-6 max-w-2xl">{data.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-stone-300 text-sm uppercase tracking-wider font-bold">Highest Peak</p>
          <p className="font-bold text-lg">{data.highest_peak_in_india}</p>
        </div>
        <div>
          <p className="text-stone-300 text-sm uppercase tracking-wider font-bold">Major Ranges</p>
          <p className="font-bold text-lg">{data.total_major_ranges}</p>
        </div>
        <div>
          <p className="text-stone-300 text-sm uppercase tracking-wider font-bold">Himalayan Length</p>
          <p className="font-bold text-lg">{data.total_himalayan_length_in_india}</p>
        </div>
      </div>
    </div>
    <Mountain className="absolute -right-10 -bottom-10 w-64 h-64 text-stone-700 opacity-50 rotate-12" />
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

const RangeSection = React.memo(({ range }: { range: any }) => (
  <Section title={range.name} color="stone">
    <div className="bg-white rounded-2xl p-6 border-2 border-stone-100 shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">About</h3>
          <p className="text-gray-600 mb-4">{range.funfact}</p>
          <div className="space-y-2 text-sm text-gray-500">
             {range.meaning && <p><span className="font-bold text-stone-700">Meaning:</span> {range.meaning}</p>}
             {range.highest_peak && <p><span className="font-bold text-stone-700">Highest Peak:</span> {range.highest_peak}</p>}
             {range.length && <p><span className="font-bold text-stone-700">Length:</span> {range.length}</p>}
          </div>
        </div>
        {range.characteristics && (
          <div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Characteristics</h3>
            <div className="flex flex-wrap gap-2">
              {range.characteristics.map((char: string, idx: number) => (
                <span key={idx} className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm font-medium">
                  {char}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {range.famous_mountains && range.famous_mountains.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            <Mountain className="w-5 h-5" /> Famous Peaks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {range.famous_mountains.map((peak: any, idx: number) => (
              <div key={idx} className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-stone-900">{peak.name}</h4>
                  <span className="text-xs bg-stone-200 text-stone-800 px-2 py-1 rounded-full font-bold">{peak.height}</span>
                </div>
                <p className="text-xs text-stone-600 mb-2">{peak.location}</p>
                <p className="text-sm text-stone-700 italic">"{peak.funfact}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {range.famous_treks && range.famous_treks.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5" /> Famous Treks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {range.famous_treks.map((trek: any, idx: number) => (
              <div key={idx} className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-emerald-900">{trek.name}</h4>
                  <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full font-bold">{trek.difficulty}</span>
                </div>
                <div className="flex gap-4 text-xs text-emerald-700 mb-2">
                  <span>{trek.duration}</span>
                  <span>{trek.max_altitude}</span>
                </div>
                <p className="text-sm text-emerald-800">{trek.funfact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </Section>
));

const StatCard = React.memo(({ label, value, subtext }: { label: string, value: string | number, subtext?: string }) => (
  <div className="bg-white rounded-xl p-6 border-2 border-blue-50 shadow-sm hover:border-blue-100 transition-all">
    <p className="text-blue-500 font-bold text-sm uppercase tracking-wider mb-2">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {subtext && <p className="text-gray-500 text-sm mt-1">{subtext}</p>}
  </div>
));

const FactCard = React.memo(({ fact, color }: { fact: any, color: string }) => (
  <div className={`bg-${color}-50 rounded-2xl p-6 border border-${color}-100 hover:shadow-md transition-all`}>
    <div className="flex items-start gap-3 mb-3">
      <Info className={`w-6 h-6 text-${color}-600 shrink-0`} />
      <h3 className={`font-bold text-${color}-900`}>{fact.fact}</h3>
    </div>
    <p className={`text-sm text-${color}-800 italic`}>{fact.funfact}</p>
  </div>
));

export default MountainKnowledge;
