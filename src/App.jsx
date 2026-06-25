import React, { useState } from 'react';
import { 
  LayoutDashboard, Trash2, Users, TrendingUp, ShieldAlert, 
  Wallet, Database, ChevronLeft, ChevronRight, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, MapPin, Brain, 
  Activity, Download, Layers, Filter, RefreshCw
} from 'lucide-react';

// ==========================================
// THEME & CONSTANTS
// ==========================================
const THEME = {
  bg: 'bg-[#F5F7FA]',
  card: 'bg-[#FFFFFF]',
  primary: '#0066FF',
  success: '#16A34A',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: 'text-[#1F2937]'
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function NonthaburiPlatform() {
  const [activeTab, setActiveTab] = useState('executive');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeFilter, setTimeFilter] = useState('Real-time');

  const menuItems = [
    { id: 'executive', name: 'Executive Overview', icon: LayoutDashboard },
    { id: 'waste-flow', name: 'Waste Flow Intelligence', icon: Trash2 },
    { id: 'community', name: 'Community Performance', icon: Users },
    { id: 'forecast', name: 'Forecast Center', icon: TrendingUp },
    { id: 'environmental', name: 'Environmental Intelligence', icon: ShieldAlert },
    { id: 'investment', name: 'Investment Planner', icon: Wallet },
    { id: 'reports', name: 'Reports & Data Quality', icon: Database },
  ];

  return (
    <div className={`min-h-screen ${THEME.bg} text-[#1F2937] font-sans flex flex-col`}>
      
      {/* TOP NAVIGATION BAR */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#0066FF] p-2 rounded-lg text-white font-bold tracking-wider text-sm">N-UIP</div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-gray-900">NONTHABURI URBAN INTELLIGENCE PLATFORM</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">PROVINCIAL DECISION ENGINE & DATA FABRIC</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Data Pipeline: Connected
          </div>
          <div className="text-xs text-gray-400 font-mono">V2.6.4 // Live</div>
        </div>
      </header>

      {/* CORE WRAPPER */}
      <div className="flex flex-1 relative">
        
        {/* LEFT SIDEBAR (COLLAPSIBLE) */}
        <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col justify-between ${sidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="py-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mx-6 mb-4 p-1.5 rounded bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200 ml-auto"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <nav className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      isActive 
                        ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/10' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile / Scope indicator */}
          {sidebarOpen && (
            <div className="p-4 m-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Active Scope</div>
              <div className="text-sm font-bold text-gray-800">Provincial Governor</div>
              <div className="text-xs text-blue-600 font-medium">All Municipalities Included</div>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA & RIGHT INSIGHT PANEL */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-x-hidden">
          
          {/* SCROLLABLE MAIN BODY */}
          <div className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto">
            
            {/* Dynamic Controls Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
              <div>
                <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">
                  System Context: Active View
                </div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab.replace('-', ' ')}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start">
                {['Real-time', '7D Trend', '30D Analysis'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${timeFilter === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* PAGE CONDITIONAL RENDERING */}
            {activeTab === 'executive' && <PageExecutiveOverview />}
            {activeTab === 'waste-flow' && <PageWasteFlow />}
            {activeTab === 'community' && <PageCommunityPerformance />}
            {activeTab === 'forecast' && <PageForecastCenter />}
            {activeTab === 'environmental' && <PageEnvironmentalIntelligence />}
            {activeTab === 'investment' && <PageInvestmentPlanner />}
            {activeTab === 'reports' && <PageReportsDataQuality />}

          </div>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 1: EXECUTIVE OVERVIEW
// ==========================================
function PageExecutiveOverview() {
  return (
    <div className="space-y-6">
      {/* BLOCK 1: AI EXECUTIVE BRIEF */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-4 bg-blue-500/20 w-fit px-3 py-1 rounded-full border border-blue-500/30">
          <Brain size={14} className="text-blue-400" />
          <span className="text-xs font-bold tracking-wide text-blue-300 uppercase">AI Executive Decision Brief</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-3">
            <p className="text-lg text-slate-100 font-medium leading-relaxed">
              Today Nonthaburi generated <span className="text-white font-bold underline decoration-blue-400 decoration-2">1,842 tons</span> of waste. 
              Recycling rate increased <span className="text-green-400 font-bold">+4%</span>. 
              Pak Kret waste volume increased <span className="text-red-400 font-bold">+11%</span>, 
              while Bang Bua Thong community participation dropped <span className="text-amber-400 font-bold">-7%</span>.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-4">
              <span>Data Fabric Sources: Municipal IoT Scales, Prov. Statistical Office, Logistics API</span>
              <span className="flex items-center gap-1 text-green-400"><RefreshCw size={10} className="animate-spin" /> Real-time</span>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-bold text-blue-400 tracking-wider uppercase">Recommended Strategic Actions</h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span> 
                <span>Deploy 3 additional mobile sorting hubs to **Pak Kret** immediately to buffer volume overflow.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span> 
                <span>Trigger targeted Line OA awareness reward multipliers in **Bang Bua Thong**.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BLOCK 2: EXECUTIVE KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Waste Generated Today', value: '1,842 Tons', change: '+2.1% vs yesterday', isDanger: true, data: 'IoT Real-time feed' },
          { title: 'Recycling Rate', value: '24.8 %', change: '+4.0% WoW shift', isDanger: false, data: 'Transfer Station Hubs' },
          { title: 'Participation Rate', value: '68.2 %', change: '-1.4% MoM structural decay', isDanger: true, data: 'LINE OA & Smart Scale' },
          { title: 'Data Coverage Score', value: '94.6 %', change: 'Excellent data confidence', isDanger: false, data: '78/82 Nodes reporting' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{kpi.title}</span>
              <div className="text-2xl font-black tracking-tight text-gray-900 mt-1">{kpi.value}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-0.5 ${kpi.isDanger ? 'text-amber-600' : 'text-green-600'}`}>
                {kpi.isDanger ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </span>
              <span className="text-gray-400 font-mono text-[10px]">{kpi.data}</span>
            </div>
          </div>
        ))}
      </section>

      {/* MID LEVEL CORE CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BLOCK 3: LIVING PROVINCE MAP */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="font-bold text-sm text-gray-900">Living Province Map</h3>
              <p className="text-xs text-gray-500">Real-time geospatial tracking across 6 operational layers</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded flex items-center gap-1">
                <Layers size={10} /> GIS Live (5m)
              </span>
            </div>
          </div>
          
          {/* Simulated Premium Map Canvas */}
          <div className="flex-1 bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden pattern-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-slate-100/40"></div>
            
            {/* Simulated abstract map layers */}
            <div className="w-full h-full border border-dashed border-gray-200 rounded-lg relative flex items-center justify-center">
              <div className="absolute text-[11px] font-bold text-gray-400 tracking-widest uppercase pointer-events-none opacity-40">
                Nonthaburi GIS Architecture Core
              </div>
              
              {/* Simulated Nodes */}
              <div className="absolute top-1/4 left-1/3 bg-blue-600 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1 animate-pulse">
                <MapPin size={10} /> Pak Kret Hub [Flow Peak]
              </div>
              <div className="absolute bottom-1/3 right-1/4 bg-slate-900 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg flex items-center gap-1">
                <Activity size={10} className="text-green-400" /> WTE Plant Active
              </div>
              <div className="absolute top-1/2 right-1/3 bg-amber-500 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg">
                Bang Bua Thong [Divergent]
              </div>
            </div>
          </div>
        </div>

        {/* SIDE BAR COMBINED SIDEBAR COLUMNS (BLOCK 4, 5, 6, 7) */}
        <div className="space-y-6">
          
          {/* BLOCK 7: EXECUTIVE ACTION CENTER */}
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={16} />
              <h3 className="font-bold text-xs uppercase tracking-wider">Executive Action Required</h3>
            </div>
            <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
              <div className="text-xs font-bold text-gray-900">Pak Kret Collection Capacity Near Limit</div>
              <p className="text-xs text-gray-500 mt-1">Silo processing index exceeds standard thresholds by 14%.</p>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <div>
                  <span className="text-gray-400 block text-[10px]">RECOM. BUDGET</span>
                  <span className="font-bold text-gray-900">2,000,000 THB</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px]">EXPECTED IMPACT</span>
                  <span className="font-bold text-green-600">+12% Recycle Cap</span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 4: TOP INSIGHTS OF THE WEEK */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-xs text-gray-400 tracking-wider uppercase">Engine Insights of the Week</h3>
            <ul className="space-y-2.5">
              <li className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border-l-2 border-blue-500">
                💡 **Village mobilization** over 70% participation drops localized organic fractions by 2.4x.
              </li>
              <li className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border-l-2 border-green-500">
                🏭 **Industrial Zone A** systemic optimization diverted 18% total mass from structural landfills.
              </li>
            </ul>
          </div>

          {/* BLOCK 5 & 6 COMBINED SUMMARY: DATA HEALTH & TOP PERFORMER */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-xs text-gray-400 tracking-wider uppercase">Data Health & Performers</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Municipality Connectivity</span>
                <span className="font-bold text-green-600">100% Operational</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Top Performer Today</span>
                <span className="font-bold text-blue-600">Mueang Nonthaburi Community</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 2: WASTE FLOW INTELLIGENCE
// ==========================================
function PageWasteFlow() {
  return (
    <div className="space-y-6">
      {/* BLOCK 1: SUMMARY */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-sm text-gray-900">Sankey Structural Optimization</h3>
          <p className="text-xs text-gray-500">Tracing massive flows from Source Generation to Ultimate Destination Matrices</p>
        </div>
        <div className="text-xs text-gray-400 font-mono">Sources: IoT Scales, Transfer Nodes, Factory Registers</div>
      </div>

      {/* BLOCK 2: SANKEY SIMULATION */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-80 flex flex-col justify-between">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Systemic Material Allocation Layer</span>
        
        {/* Abstract Linear Representation of Node Flow */}
        <div className="grid grid-cols-6 gap-2 text-center items-center my-auto relative">
          {[
            { label: 'Households', val: '1,200T', color: 'bg-blue-500' },
            { label: 'Collection Nodes', val: '1,180T', color: 'bg-indigo-500' },
            { label: 'Sorting Grid', val: '950T', color: 'bg-purple-500' },
            { label: 'Recycled Asset', val: '400T', color: 'bg-green-500' },
            { label: 'WTE Conversion', val: '500T', color: 'bg-amber-500' },
            { label: 'Landfill Matrix', val: '280T', color: 'bg-red-500' },
          ].map((step, idx) => (
            <div key={idx} className="space-y-2 relative">
              <div className={`${step.color} text-white p-2 rounded-lg text-xs font-bold shadow-sm`}>
                {step.val}
              </div>
              <div className="text-[11px] font-medium text-gray-600 truncate">{step.label}</div>
              {idx < 5 && <div className="hidden lg:block absolute top-3 -right-2 text-gray-300 font-bold">→</div>}
            </div>
          ))}
        </div>
        
        <div className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
          ⚠️ **Traceability Gap Discovered:** 20T variance detected between Generation nodes and Central Sorting Infrastructure.
        </div>
      </div>

      {/* BLOCKS 3 - 7: METRIC ARRAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">District Waste Ranking (Mass)</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span>1. Pak Kret</span><span className="font-bold">542 Tons/D</span></div>
            <div className="flex justify-between"><span>2. Mueang Nonthaburi</span><span className="font-bold">498 Tons/D</span></div>
            <div className="flex justify-between"><span>3. Bang Bua Thong</span><span className="font-bold">310 Tons/D</span></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Route Bottleneck System Status</h4>
          <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-800">
            **Route PK-04 (Pak Kret):** Suboptimal scheduling has resulted in collection delays averaging +42 mins.
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Destination Infrastructure Breakdown</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span>WTE Plant Intake</span><span className="text-green-600 font-bold">62% Capacity</span></div>
            <div className="flex justify-between"><span>Saino Landfill Matrix</span><span className="text-red-500 font-bold">89% Terminal Volume</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 3: COMMUNITY PERFORMANCE
// ==========================================
function PageCommunityPerformance() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <h3 className="font-bold text-sm mb-1">Civilian Engagement & Ledger Validation</h3>
        <p className="text-xs text-gray-500">Cross-referencing LINE OA transactions with localized smart-scale returns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Performance Scoreboard vs Participation Heatmap</span>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Mueang Nonthaburi Smart Pilot', score: 94, state: 'Optimal engagement', color: 'bg-green-600' },
              { name: 'Bang Kruai Green Alliance', score: 82, state: 'Steady metrics', color: 'bg-blue-600' },
              { name: 'Bang Bua Thong Core Cluster', score: 48, state: 'Requires structural campaign', color: 'bg-amber-500' },
            ].map((c, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{c.name}</span>
                  <span className="font-mono font-bold">{c.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className={`${c.color} h-full`} style={{ width: `${c.score}%` }}></div>
                </div>
                <div className="text-[10px] text-gray-400 font-medium">{c.state}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
          <div>
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Community Recycling Ledger</span>
            <div className="text-2xl font-black text-green-600 mt-1">4,210,500 THB</div>
            <p className="text-xs text-gray-500">Aggregate capitalization distributed via localized environmental initiatives.</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
            💡 **Strategic Insight:** High-trust environments show a 3.1x acceleration in systemic waste diversion.
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 4: FORECAST CENTER
// ==========================================
function PageForecastCenter() {
  return (
    <div className="space-y-6">
      {/* AI SCENARIO SIMULATOR BLOCK */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 text-blue-400 mb-3">
          <Brain size={16} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Predictive Modeling Engine</h3>
        </div>
        
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs text-gray-400 font-mono">SIMULATION HYPOTHESIS: IF 50 ADDITIONAL VILLAGES CONVERGE ON SMART SYSTEMS</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="border-l-2 border-green-500 pl-3">
              <span className="text-[10px] uppercase block tracking-wider text-gray-400">Projected System Diversion</span>
              <span className="text-lg font-black text-green-400">+3,200 Total Tons</span>
            </div>
            <div className="border-l-2 border-blue-500 pl-3">
              <span className="text-[10px] uppercase block tracking-wider text-gray-400">Incremental Fund Accumulation</span>
              <span className="text-lg font-black text-blue-400">+5.1M THB / Annum</span>
            </div>
          </div>
        </div>
      </div>

      {/* FORECAST MATRIX OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { horizon: '3-Month Run Rate', projection: '5,620 Tons Absolute', risk: 'Stable infrastructure', color: 'border-blue-500' },
          { horizon: '6-Month Real Estate Shift', projection: '6,110 Tons Absolute', risk: 'High urban expansion trend', color: 'border-amber-500' },
          { horizon: '12-Month Saturation Horizon', projection: '7,400 Tons Absolute', risk: 'Exceeds processing ceiling', color: 'border-red-500' },
        ].map((item, i) => (
          <div key={i} className={`bg-white border-t-4 ${item.color} rounded-xl p-4 shadow-sm flex flex-col justify-between`}>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{item.horizon}</span>
              <div className="text-lg font-black text-gray-900 mt-1">{item.projection}</div>
            </div>
            <div className="text-[11px] text-gray-500 mt-4 bg-gray-50 p-2 rounded font-medium">
              🚨 {item.risk}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// PAGE 5: ENVIRONMENTAL INTELLIGENCE
// ==========================================
function PageEnvironmentalIntelligence() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs font-bold text-gray-400 block tracking-wider uppercase">Carbon Offsetting Matrix</span>
          <div className="text-xl font-bold text-green-600 mt-1">1,240 Tons CO₂e</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs font-bold text-gray-400 block tracking-wider uppercase">Methane Capture / Abatement</span>
          <div className="text-xl font-bold text-blue-600 mt-1">420 Tons Net CH₄</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-xs font-bold text-gray-400 block tracking-wider uppercase">Air Quality Monitoring (AQI Avg)</span>
          <div className="text-xl font-bold text-amber-500 mt-1">72 PM2.5 Moderate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-3">Civilian Grievance / Anomaly Hotspot Map</span>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-800 font-medium">
            **Zone Notification:** Odor reports peaking within a 1.2km radius of the central transfer node between 19:00 - 22:00.
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block mb-3">ESG Operational Readiness Index</span>
          <div className="text-lg font-black text-emerald-700">Level AA Compliant</div>
          <p className="text-xs text-gray-500 mt-1">Provincial processing aligns with rigorous international framework benchmarks.</p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 6: INVESTMENT PLANNER
// ==========================================
function PageInvestmentPlanner() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200">
        <h3 className="font-bold text-sm mb-1">Capital Budgeting Allocation Simulator</h3>
        <p className="text-xs text-gray-500">Algorithmic optimization maximizing long-term localized economic return.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <span className="text-xs font-bold text-gray-400 tracking-wider uppercase block">Infrastructure Pipeline Proposals</span>
          <div className="space-y-2">
            {[
              { asset: 'Smart Compactor EV Fleet Integration', budget: '12.4M THB', roi: '+18% Efficiency' },
              { asset: 'AI-Optical Sorting Hub Expansion', budget: '8.5M THB', roi: '-22% Waste to Landfill' }
            ].map((prop, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-gray-900">{prop.asset}</div>
                  <div className="text-gray-400 font-medium mt-0.5">Budget: {prop.budget}</div>
                </div>
                <span className="bg-green-50 text-green-700 font-bold px-2 py-1 rounded">{prop.roi}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 bg-white/20 w-fit px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              AI Allocation Engine Recommendation
            </div>
            <p className="text-sm font-medium mt-3 leading-relaxed">
              Redirecting **3.8M THB** from legacy un-monitored bins to **Sub-district Scaled Infrastructure** yields optimal carbon mitigation within a 14-month validation loop.
            </p>
          </div>
          <button className="bg-white text-blue-700 font-bold text-xs py-2 rounded-lg mt-4 shadow hover:bg-gray-50 transition-all">
            Commit Dynamic Recommendation Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 7: REPORTS & DATA QUALITY
// ==========================================
function PageReportsDataQuality() {
  return (
    <div className="space-y-6">
      {/* DATA HEALTH SYSTEM STATUS MATRIX */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Data Connectivity Fabric & Schema Validation</h3>
            <p className="text-xs text-gray-500">Real-time status monitoring of 82 localized ingestion streams.</p>
          </div>
          <button className="flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg shadow-sm font-semibold">
            <Filter size={12} /> System Filter
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {[
            { node: 'Pak Kret Central Collection Node', type: 'IoT Stream API', status: 'Online', compliance: '100%' },
            { node: 'Bang Bua Thong Logistics Tracker', type: 'CSV Manual Sync', status: 'Missing Payload (24h)', compliance: '72%' },
            { node: 'Mueang Nonthaburi Smart Scale Network', type: 'MQTT Live Telemetry', status: 'Online', compliance: '98%' },
            { node: 'Saino Waste-To-Energy Facility Ledger', type: 'Database Mirror Link', status: 'Online', compliance: '100%' },
          ].map((row, i) => (
            <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/50 transition-all">
              <div className="space-y-0.5">
                <div className="font-bold text-gray-900">{row.node}</div>
                <div className="text-[11px] text-gray-400 font-mono font-medium">{row.type}</div>
              </div>
              
              <div className="flex items-center gap-6 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px] font-semibold uppercase">Ingestion Health</span>
                  <span className={`font-bold ${row.status.includes('Online') ? 'text-green-600' : 'text-red-500'}`}>{row.status}</span>
                </div>
                <div className="text-right min-w-[70px]">
                  <span className="text-gray-400 block text-[10px] font-semibold uppercase">Data Confidence</span>
                  <span className="font-mono font-bold text-gray-900">{row.compliance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOWNLOAD CENTER EXPORT ARTIFACTS */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Strategic Data Asset Export Center</h4>
          <p className="text-xs text-gray-500 mt-0.5">Compile formal environmental telemetry variables for policy documentation and audit trails.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Export Clean CSV Matrix', 'Generate Structured Microsoft Excel Asset', 'Compile Exec Power BI Dashboard Package', 'Download Executive Signed PDF Report'].map((label, idx) => (
            <button key={idx} className="flex items-center gap-1.5 text-xs border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-3 py-2 rounded-lg transition-all shadow-sm">
              <Download size={13} className="text-gray-400" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
