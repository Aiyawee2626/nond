import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

import communityRaw from './data/clean_community.csv?raw';
import recycleRaw from './data/clean_recycle.csv?raw';
import wetRaw from './data/clean_wet.csv?raw';
import benefitRaw from './data/clean_benefit.csv?raw';
import virusRaw from './data/clean_virusdispose.csv?raw';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement
);

// ── CSV helpers ──────────────────────────────────────────────────────────────
function parseCSV(raw) {
  const lines = raw.replace(/\r/g, '').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1)
    .map(line => {
      const vals = line.split(',');
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? '').trim()]));
    })
    .filter(r => Object.values(r).some(v => v));
}

const toNum  = v => parseFloat(v) || 0;
const sumKey = (arr, key) => arr.reduce((s, r) => s + toNum(r[key]), 0);
const pct    = (n, d) => (d > 0 ? (n / d * 100) : 0);
const fmtTon = v => v >= 10000
  ? `${(v / 1000).toFixed(1)} พันตัน`
  : `${Math.round(v).toLocaleString()} ตัน`;

// ── Parse all datasets ────────────────────────────────────────────────────────
const community = parseCSV(communityRaw); // ปี,เดือน,อำเภอ,อปท.,ขยะมูลฝอยชุมชน(ตัน)
const recycle   = parseCSV(recycleRaw);  // ปี,เดือน,อำเภอ,อปท,ขยะรีไซเคิลลงถัง(ตัน)
const wet       = parseCSV(wetRaw);      // ปี,เดือน,อำเภอ,อปท,ขยะอินทรีย์ลงถัง(ตัน)
const benefit   = parseCSV(benefitRaw); // ปี,เดือน,อำเภอ,อปท,ขยะนำไปใช้ประโยชน์
const virus     = parseCSV(virusRaw);   // ปี,เดือน,อำเภอ,อปท,ขยะติดเชื้อ,ขยะกำจัดถูกต้อง

const YEAR  = '2567';
const YEARS = ['2563', '2564', '2565', '2566', '2567'];

// Latest-year slices
const comm = community.filter(r => r['ปี'] === YEAR);
const rec  = recycle.filter(r => r['ปี'] === YEAR);
const org  = wet.filter(r => r['ปี'] === YEAR);
const ben  = benefit.filter(r => r['ปี'] === YEAR);
const vir  = virus.filter(r => r['ปี'] === YEAR);

// Province-level totals (ตัน/ปี)
const totalComm = sumKey(comm, 'ขยะมูลฝอยชุมชน(ตัน)');
const totalRec  = sumKey(rec,  'ขยะรีไซเคิลลงถัง(ตัน)');
const totalOrg  = sumKey(org,  'ขยะอินทรีย์ลงถัง(ตัน)');
const totalBen  = sumKey(ben,  'ขยะนำไปใช้ประโยชน์');

// ── KPI calculations ─────────────────────────────────────────────────────────
const recyclingRate    = pct(totalRec, totalComm);
const leakageRate      = Math.max(0, pct(totalComm - totalRec - totalBen, totalComm));
const commNonZero      = comm.filter(r => toNum(r['ขยะมูลฝอยชุมชน(ตัน)']) > 0).length;
const dataCompleteness = pct(commNonZero, comm.length);

const DISTRICTS = ['ปากเกร็ด', 'เมืองนนทบุรี', 'บางกรวย', 'บางบัวทอง', 'บางใหญ่', 'ไทรน้อย'];

const distStats = DISTRICTS.map(d => {
  const cRows  = comm.filter(r => r['อำเภอ'] === d);
  const rRows  = rec.filter(r => r['อำเภอ'] === d);
  const totalW = sumKey(cRows, 'ขยะมูลฝอยชุมชน(ตัน)');
  const totalR = sumKey(rRows, 'ขยะรีไซเคิลลงถัง(ตัน)');
  const rRate  = pct(totalR, totalW);
  return { district: d, totalW, totalR, rRate, hasData: cRows.length > 0 };
});

const districtsWithData = distStats.filter(d => d.hasData).length;
const flowCoverage      = pct(districtsWithData, DISTRICTS.length);

const maxW = Math.max(...distStats.map(d => d.totalW), 1);
const distOpportunity = distStats
  .map(d => ({
    ...d,
    weeklyTons: d.totalW / 52,
    oppIndex: d.totalW > 0
      ? Math.round((d.totalW / maxW) * (1 - d.rRate / 100) * 100)
      : 0,
    clusterLabel: d.rRate < 5
      ? 'กลุ่ม 1: ขยะสูง-รีไซเคิลต่ำ'
      : d.rRate < 15
      ? 'กลุ่ม 2: ขยะกลาง-รีไซเคิลปานกลาง'
      : 'กลุ่ม 3: รีไซเคิลดี',
    clusterColor: d.rRate < 5 ? 'amber' : d.rRate < 15 ? 'orange' : 'blue',
  }))
  .sort((a, b) => b.oppIndex - a.oppIndex);

const totalWAll = distStats.reduce((s, d) => s + d.totalW, 0);
const opportunityIndex = totalWAll > 0
  ? Math.min(100, Math.round(
      distOpportunity.reduce((s, d) => s + d.oppIndex * d.totalW, 0) / totalWAll
    ))
  : 0;

// ── Chart: waste type composition ────────────────────────────────────────────
const otherTons = Math.max(0, totalComm - totalOrg - totalRec - totalBen);
const edaTypesData = {
  labels: ['ขยะอินทรีย์', 'ขยะรีไซเคิล', 'ขยะนำไปใช้ประโยชน์', 'ขยะทั่วไป/อื่นๆ'],
  datasets: [{
    data: [
      Math.round(totalOrg),
      Math.round(totalRec),
      Math.round(totalBen),
      Math.round(otherTons),
    ],
    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#94a3b8'],
  }],
};

// ── Chart: waste by district ──────────────────────────────────────────────────
const edaDistrictData = {
  labels: distStats.map(d => d.district),
  datasets: [{
    label: 'ขยะมูลฝอยชุมชน (ตัน/ปี 2567)',
    data: distStats.map(d => Math.round(d.totalW)),
    backgroundColor: '#10b981',
  }],
};

// ── Forecast ──────────────────────────────────────────────────────────────────
const yearlyTotals = YEARS.map(y =>
  Math.round(sumKey(community.filter(r => r['ปี'] === y), 'ขยะมูลฝอยชุมชน(ตัน)'))
);

function linReg(ys) {
  const n = ys.length, xm = (n - 1) / 2;
  const ym = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  ys.forEach((y, x) => { num += (x - xm) * (y - ym); den += (x - xm) ** 2; });
  const slope = den ? num / den : 0;
  return x => Math.round(ym + slope * (x - xm));
}
const predict    = linReg(yearlyTotals);
const baseLatest = yearlyTotals[4] || 0;

const forecastModelData = {
  labels: ['2563', '2564', '2565', '2566', '2567', '2568', '2570', '2572'],
  datasets: [
    {
      label: 'กรณีปล่อยไว้ตามปกติ (Baseline Forecast)',
      data: [...yearlyTotals, predict(5), predict(7), predict(9)],
      borderColor: '#f43f5e',
      borderDash: [5, 5],
      fill: false,
      tension: 0.3,
    },
    {
      label: 'เป้าหมายเมื่อขับเคลื่อนแพลตฟอร์ม (Target)',
      data: [
        ...yearlyTotals,
        Math.round(baseLatest * 0.97),
        Math.round(baseLatest * 0.91),
        Math.round(baseLatest * 0.85),
      ],
      borderColor: '#10b981',
      fill: false,
      tension: 0.3,
    },
  ],
};

// ── Flow tab ──────────────────────────────────────────────────────────────────
const topDistricts = [...distStats].sort((a, b) => b.totalW - a.totalW).slice(0, 3);
const leakageAbs   = Math.max(0, totalComm - totalRec - totalBen);

// ── Quality stats ─────────────────────────────────────────────────────────────
const totalRecords   = community.length + recycle.length + wet.length + benefit.length + virus.length;
const nonZeroComm    = community.filter(r => toNum(r['ขยะมูลฝอยชุมชน(ตัน)']) > 0).length;
const nonZeroRec     = recycle.filter(r => toNum(r['ขยะรีไซเคิลลงถัง(ตัน)']) > 0).length;
const nonZeroOrg     = wet.filter(r => toNum(r['ขยะอินทรีย์ลงถัง(ตัน)']) > 0).length;
const totalNonZero   = nonZeroComm + nonZeroRec + nonZeroOrg;
const missingPct     = Math.max(0, 100 - pct(totalNonZero, totalRecords));

// ── Component ─────────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const titles = {
    overview:    ['Provincial Overview (ภาพรวมจังหวัด)',        'สรุปสถิติสำคัญและดัชนีชี้วัดการจัดการขยะของจังหวัดนนทบุรี'],
    flow:        ['Waste Flow Map (ผังกระแสข้อมูลขยะ)',          'ติดตามเส้นทางการเคลื่อนที่ของขยะในพื้นที่ตั้งแต่ต้นทางถึงปลายทาง'],
    opportunity: ['Recycling Opportunity Index',                 'วิเคราะห์และแบ่งกลุ่มเชิงสถิติเพื่อหาพื้นที่ที่มีศักยภาพสูงสุดในการลงทุนด้านสิ่งแวดล้อม'],
    quality:     ['Data Quality & Governance',                   'การจัดการมาตรฐานความสะอาดและความครบถ้วนของข้อมูลขยะ'],
    forecast:    ['Waste Forecast Dashboard',                    'พยากรณ์ปริมาณขยะล่วงหน้า 1 ปี, 3 ปี และ 5 ปี เพื่อสนับสนุนการวางแผนเชิงนโยบาย'],
  };

  const clusterBadge = color => ({
    amber:  'bg-amber-100 text-amber-800',
    orange: 'bg-orange-100 text-orange-800',
    blue:   'bg-blue-100 text-blue-800',
  }[color] || 'bg-slate-100 text-slate-800');

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex font-['Sarabun',sans-serif]">
      {/* ── Sidebar ── */}
      <div className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl fixed h-full z-20">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-emerald-500 rounded-lg">
              <i className="fa-solid fa-leaf text-xl text-white"></i>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">NWIP Platform</h1>
              <p className="text-xs text-slate-400">นนทบุรี เมืองอัจฉริยะ</p>
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg mb-6 border border-slate-700">
            <p className="text-xs text-emerald-400 font-semibold mb-1">
              <i className="fa-solid fa-bullseye mr-1"></i> Core Mission:
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              "เราไม่ได้แก้ปัญหาขยะ แต่เรากำลังแก้ปัญหาการมองไม่เห็นการไหลของขยะ"
            </p>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'overview',    icon: 'fa-chart-pie',      text: '1. Provincial Overview' },
              { id: 'flow',        icon: 'fa-route',          text: '2. Waste Flow Map' },
              { id: 'opportunity', icon: 'fa-lightbulb',      text: '3. Recycling Opportunity' },
              { id: 'quality',     icon: 'fa-shield-halved',  text: '4. Data Quality' },
              { id: 'forecast',    icon: 'fa-chart-line',     text: '5. Forecast Model' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${tab.icon} w-5`}></i>
                <span>{tab.text}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 bg-slate-950 text-xs border-t border-slate-800">
          <div className="flex items-center justify-between mb-1 text-slate-400">
            <span>สถานะระบบ (MVP):</span>
            <span className="text-emerald-400 font-bold flex items-center">
              <span className="h-2 w-2 bg-emerald-400 rounded-full inline-block mr-1.5 animate-pulse"></span>
              พื้นที่นำร่อง
            </span>
          </div>
          <p className="text-slate-500 text-[11px]">ข้อมูลจริงปี 2563–2567 ({totalRecords.toLocaleString()} รายการ)</p>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{titles[activeTab][0]}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{titles[activeTab][1]}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <i className="fa-solid fa-map-pin mr-1.5"></i> ข้อมูลจริง: 6 อำเภอ นนทบุรี
            </span>
            <div className="h-8 w-px bg-gray-200"></div>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-all relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="p-8 space-y-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">KPI 1: Waste Flow Coverage</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-slate-800">{flowCoverage.toFixed(1)}%</span>
                    <span className="text-xs text-emerald-500 font-medium">
                      <i className="fa-solid fa-check"></i> {districtsWithData}/{DISTRICTS.length} อำเภอ
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">อำเภอที่มีข้อมูลขยะครบถ้วน</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">KPI 2: Recycling Recovery</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-emerald-600">{recyclingRate.toFixed(1)}%</span>
                    <span className="text-xs text-emerald-500 font-medium">
                      <i className="fa-solid fa-recycle"></i> ปี {YEAR}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">ขยะที่เข้าสู่การรีไซเคิลจริง</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">KPI 3: Waste Leakage Rate</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-rose-600">{leakageRate.toFixed(1)}%</span>
                    <span className="text-xs text-rose-500 font-medium">
                      <i className="fa-solid fa-triangle-exclamation"></i> ไม่ทราบปลายทาง
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">ขยะที่ยังไม่ถูกบันทึกปลายทาง</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">KPI 4: Data Completeness</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-blue-600">{dataCompleteness.toFixed(1)}%</span>
                    <span className="text-xs text-emerald-500 font-medium">
                      <i className="fa-solid fa-check"></i> ผ่านเกณฑ์
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">ความครบถ้วนของข้อมูลชุมชน</p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">KPI 5: Recycling Opportunity</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-amber-600">{opportunityIndex}/100</span>
                    <span className="text-xs text-slate-500 font-medium">ระดับ: {opportunityIndex >= 70 ? 'สูง' : opportunityIndex >= 40 ? 'กลาง' : 'ต่ำ'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">ดัชนีโอกาสขยายผลการรีไซเคิล</p>
                </div>
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-700 mb-1">
                    <i className="fa-solid fa-chart-bar mr-1.5 text-emerald-500"></i>
                    ปริมาณขยะจำแนกตามประเภท (ตัน/ปี {YEAR})
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">
                    รวมทั้งจังหวัด: {fmtTon(totalComm)}
                  </p>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut
                      data={edaTypesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
                      }}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-700 mb-1">
                    <i className="fa-solid fa-map mr-1.5 text-blue-500"></i>
                    ปริมาณขยะมูลฝอยชุมชนแยกรายอำเภอ (ตัน/ปี {YEAR})
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-4">
                    อำเภอที่มีปริมาณสูงสุด: {distStats.reduce((a, b) => a.totalW > b.totalW ? a : b).district}
                  </p>
                  <div className="h-64 flex items-center justify-center">
                    <Bar
                      data={edaDistrictData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FLOW ── */}
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                <h3 className="text-sm font-bold text-gray-700 mb-1">
                  ผังจำลองการไหลของขยะ (Waste Flow Visualizer)
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  ข้อมูลจริงปี {YEAR} — รวมทั้งจังหวัด: {fmtTon(totalComm)} &nbsp;|&nbsp;
                  รีไซเคิล: {fmtTon(totalRec)} &nbsp;|&nbsp;
                  ไม่ทราบปลายทาง: {fmtTon(leakageAbs)}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Sources */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 text-center border-b pb-2">
                      1. แหล่งกำเนิด (อำเภอ)
                    </h4>
                    {topDistricts.map((d, i) => (
                      <div key={d.district} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {d.district} (SRC-0{i + 1})
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-sm font-mono">
                          {fmtTon(d.totalW)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Column 2: Transport */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 text-center border-b pb-2">
                      2. การจัดเก็บ & ขนส่ง
                    </h4>
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-800">
                        <i className="fa-solid fa-truck mr-1"></i> รถขนส่งเทศบาล (ขยะชุมชน)
                      </span>
                      <span className="bg-emerald-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        {fmtTon(totalComm)}
                      </span>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800">
                        <i className="fa-solid fa-store mr-1"></i> ช่องทางรีไซเคิล/นำกลับใช้
                      </span>
                      <span className="bg-amber-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        {fmtTon(totalRec + totalBen)}
                      </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-800">
                        <i className="fa-solid fa-recycle mr-1"></i> ขยะรีไซเคิลลงถัง
                      </span>
                      <span className="bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        {fmtTon(totalRec)}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Destination */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 text-center border-b pb-2">
                      3. ปลายทาง (Destination)
                    </h4>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">ขยะรีไซเคิล</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[11px] px-2 py-0.5 rounded-sm font-semibold">
                        {fmtTon(totalRec)}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">ขยะนำไปใช้ประโยชน์</span>
                      <span className="bg-amber-100 text-amber-700 text-[11px] px-2 py-0.5 rounded-sm font-semibold">
                        {fmtTon(totalBen)}
                      </span>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-700">
                        <i className="fa-solid fa-triangle-exclamation mr-1"></i> ไม่ทราบปลายทาง
                      </span>
                      <span className="bg-rose-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        {fmtTon(leakageAbs)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── OPPORTUNITY ── */}
          {activeTab === 'opportunity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    <i className="fa-solid fa-layer-group text-amber-500 mr-2"></i>
                    วิเคราะห์จัดกลุ่มรายอำเภอ (Clustering Analysis) — ปี {YEAR}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-gray-100">
                          <th className="p-3">อำเภอ</th>
                          <th className="p-3">กลุ่ม (Cluster)</th>
                          <th className="p-3">ขยะรายสัปดาห์</th>
                          <th className="p-3">อัตรารีไซเคิล</th>
                          <th className="p-3 text-right">Recycling Opportunity Index</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {distOpportunity.map(d => (
                          <tr key={d.district}>
                            <td className="p-3 text-gray-800 font-bold">{d.district}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-sm text-[11px] ${clusterBadge(d.clusterColor)}`}>
                                {d.clusterLabel}
                              </span>
                            </td>
                            <td className="p-3">{fmtTon(d.weeklyTons)}/สัปดาห์</td>
                            <td className={`p-3 ${d.rRate < 5 ? 'text-rose-500' : d.rRate < 15 ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {d.rRate.toFixed(1)}%
                            </td>
                            <td className="p-3 text-right font-bold text-amber-600">
                              {d.oppIndex} / 100
                              {d.oppIndex >= 70 && <i className="fa-solid fa-arrow-trend-up ml-1"></i>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-2">
                      <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
                      ข้อเสนอแนะเชิงนโยบาย (AI Insight)
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">ประมวลผลจากข้อมูลจริงปี {YEAR}</p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                      <p>
                        💡 <b>เร่งด่วนที่สุด:</b> อำเภอ <b>{distOpportunity[0]?.district}</b> มีดัชนีโอกาสสูงถึง{' '}
                        {distOpportunity[0]?.oppIndex}/100 เนื่องจากมีปริมาณขยะสูงแต่อัตรารีไซเคิลเพียง{' '}
                        {distOpportunity[0]?.rRate.toFixed(1)}%
                      </p>
                      {distOpportunity[1] && (
                        <p>
                          💡 <b>เป้าหมายถัดไป:</b> อำเภอ <b>{distOpportunity[1].district}</b> (ดัชนี {distOpportunity[1].oppIndex}/100)
                          มีศักยภาพในการลดขยะปลายทางได้อีกมากหากเพิ่มจุดรับรีไซเคิล
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] text-gray-400 flex items-center justify-between">
                    <span>คำนวณจากข้อมูลจริง {YEAR}</span>
                    <i className="fa-solid fa-robot"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── QUALITY ── */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    <i className="fa-solid fa-circle-check text-blue-500 mr-2"></i>
                    สถานะ Data Governance (ชุดข้อมูลที่ผ่านการทำความสะอาดแล้ว)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-600">รายการข้อมูลทั้งหมดในระบบ</span>
                        <span className="text-slate-700 font-bold">{totalRecords.toLocaleString()} รายการ (5 ชุดข้อมูล)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-600">รายการที่มีค่าข้อมูล (ไม่เป็นศูนย์)</span>
                        <span className="text-emerald-600 font-bold">
                          {totalNonZero.toLocaleString()} รายการ ({pct(totalNonZero, totalRecords).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${pct(totalNonZero, totalRecords).toFixed(1)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-600">รายการที่มีค่าศูนย์/ว่าง (Missing/Zero Values)</span>
                        <span className="text-amber-600 font-bold">
                          {missingPct.toFixed(1)}% (อยู่ระหว่างตรวจสอบหน้างาน)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full"
                          style={{ width: `${(100 - missingPct).toFixed(1)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>ขยะมูลฝอยชุมชน — รายการที่มีข้อมูล</span>
                        <span className="font-semibold text-gray-700">{nonZeroComm.toLocaleString()} / {community.length.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ขยะรีไซเคิล — รายการที่มีข้อมูล</span>
                        <span className="font-semibold text-gray-700">{nonZeroRec.toLocaleString()} / {recycle.length.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ขยะอินทรีย์ — รายการที่มีข้อมูล</span>
                        <span className="font-semibold text-gray-700">{nonZeroOrg.toLocaleString()} / {wet.length.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-4">
                      <i className="fa-solid fa-database text-purple-500 mr-2"></i>
                      โครงสร้างผังเชื่อมโยงชุดข้อมูล (Data Sources Catalog)
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { title: 'ขยะมูลฝอยชุมชน', desc: `${community.length.toLocaleString()} รายการ / รายเดือน` },
                        { title: 'ขยะรีไซเคิล',      desc: `${recycle.length.toLocaleString()} รายการ / รายเดือน` },
                        { title: 'ขยะอินทรีย์',       desc: `${wet.length.toLocaleString()} รายการ / รายเดือน` },
                        { title: 'ขยะนำไปใช้ประโยชน์', desc: `${benefit.length.toLocaleString()} รายการ / รายเดือน` },
                        { title: 'ขยะติดเชื้อ',       desc: `${virus.length.toLocaleString()} รายการ / รายเดือน` },
                        { title: 'ครอบคลุม',          desc: 'ปี 2563–2567 (5 ปี)' },
                      ].map(item => (
                        <div key={item.title} className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                          <p className="font-bold text-slate-700">{item.title}</p>
                          <p className="text-gray-400 text-[11px]">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── FORECAST ── */}
          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                <h3 className="text-sm font-bold text-gray-700 mb-1">
                  <i className="fa-solid fa-chart-line text-indigo-500 mr-2"></i>
                  พยากรณ์ปริมาณขยะรวมจังหวัดนนทบุรี (Predictive Modeling)
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  ข้อมูลจริงปี 2563–2567 + คาดการณ์ด้วย Linear Regression &nbsp;|&nbsp;
                  ปัจจุบัน ({YEAR}): {fmtTon(baseLatest)}
                </p>
                <div className="h-80 w-full flex justify-center">
                  <Line
                    data={forecastModelData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { labels: { font: { size: 11 } } } },
                      scales: {
                        y: {
                          ticks: {
                            font: { size: 10 },
                            callback: v => `${(v / 1000).toFixed(0)}k`,
                          },
                        },
                        x: { ticks: { font: { size: 10 } } },
                      },
                    }}
                  />
                </div>

                {/* Year-by-year historical table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase font-semibold border-b">
                        {YEARS.map(y => <th key={y} className="p-2 text-center">ปี {y}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {yearlyTotals.map((t, i) => (
                          <td key={i} className="p-2 text-center font-mono text-slate-700 font-semibold">
                            {fmtTon(t)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 flex items-start space-x-3">
                  <i className="fa-solid fa-circle-info mt-0.5 text-indigo-500 text-sm"></i>
                  <div>
                    <p className="font-bold">สรุปผลจากแบบจำลองการคาดการณ์ (Statistical Forecast)</p>
                    <p className="text-indigo-700 mt-1">
                      หากไม่มีมาตรการกระตุ้นการรีไซเคิล คาดว่าปริมาณขยะจะเพิ่มขึ้นตามแนวโน้ม (Baseline){' '}
                      จากปัจจุบัน {fmtTon(baseLatest)} เป็น {fmtTon(predict(9))} ภายในปี 2572&nbsp;
                      ขณะที่หากขับเคลื่อนแพลตฟอร์มได้ตามเป้า จะสามารถลดลงเหลือ{' '}
                      {fmtTon(Math.round(baseLatest * 0.85))} ในระยะ 5 ปี
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
