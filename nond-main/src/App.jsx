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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const titles = {
    overview: [
      'Provincial Overview (ภาพรวมจังหวัด)',
      'สรุปสถิติสำคัญและดัชนีชี้วัดการจัดการขยะของจังหวัดนนทบุรี',
    ],
    flow: [
      'Waste Flow Map (ผังกระแสข้อมูลขยะ)',
      'ติดตามเส้นทางการเคลื่อนที่ของขยะในพื้นที่ตั้งแต่ต้นทางถึงปลายทาง',
    ],
    opportunity: [
      'Recycling Opportunity Index',
      'วิเคราะห์และแบ่งกลุ่มเชิงสถิติเพื่อหาพื้นที่ที่มีศักยภาพสูงสุดในการลงทุนด้านสิ่งแวดล้อม',
    ],
    quality: [
      'Data Quality & Governance',
      'การจัดการมาตรฐานความสะอาดและความครบถ้วนของข้อมูลขยะ',
    ],
    forecast: [
      'Waste Forecast Dashboard',
      'พยากรณ์ปริมาณขยะล่วงหน้า 1 ปี, 3 ปี และ 5 ปี เพื่อสนับสนุนการวางแผนเชิงนโยบาย',
    ],
  };

  const edaTypesData = {
    labels: ['ขยะอินทรีย์', 'พลาสติก/รีไซเคิล', 'ขยะทั่วไป', 'ขยะอันตราย'],
    datasets: [
      {
        data: [55, 22, 18, 5],
        backgroundColor: ['#10b981', '#3b82f6', '#94a3b8', '#f43f5e'],
      },
    ],
  };

  const edaPopData = {
    labels: ['ชุมชนหมู่บ้านจัดสรร A', 'คอนโดสุรวงศ์', 'ตลาดสดนนท์โมเดิร์น'],
    datasets: [
      {
        label: 'อัตราสร้างขยะ (กก./คน/วัน)',
        data: [1.12, 0.85, 2.4],
        backgroundColor: '#10b981',
      },
    ],
  };

  const forecastModelData = {
    labels: ['ปัจจุบัน', 'ปีที่ 1 (2027)', 'ปีที่ 3 (2029)', 'ปีที่ 5 (2031)'],
    datasets: [
      {
        label: 'กรณีปล่อยไว้ตามปกติ (Baseline Forecast)',
        data: [93.8, 97.3, 104.9, 113.2],
        borderColor: '#f43f5e',
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'เป้าหมายเมื่อขับเคลื่อนแพลตฟอร์ม (Target)',
        data: [93.8, 91.0, 83.5, 75.0],
        borderColor: '#10b981',
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex font-['Sarabun',sans-serif]">
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
              “เราไม่ได้แก้ปัญหาขยะ แต่เรากำลังแก้ปัญหาการมองไม่เห็นการไหลของขยะ”
            </p>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', icon: 'fa-chart-pie', text: '1. Provincial Overview' },
              { id: 'flow', icon: 'fa-route', text: '2. Waste Flow Map' },
              { id: 'opportunity', icon: 'fa-lightbulb', text: '3. Recycling Opportunity' },
              { id: 'quality', icon: 'fa-shield-halved', text: '4. Data Quality' },
              { id: 'forecast', icon: 'fa-chart-line', text: '5. Forecast Model' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${tab.icon} w-5`}></i> <span>{tab.text}</span>
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
          <p className="text-slate-500 text-[11px]">
            เชื่อมต่อ n8n Workflow & Gemini 2.5 Flash เรียบร้อย
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{titles[activeTab][0]}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{titles[activeTab][1]}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <i className="fa-solid fa-map-pin mr-1.5"></i> นำร่อง: 1 เทศบาล/หมู่บ้านจัดสรร
            </span>
            <div className="h-8 w-px bg-gray-200"></div>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-all relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="p-8 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">
                    KPI 1: Waste Flow Coverage
                  </span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-slate-800">74.5%</span>
                    <span className="text-xs text-emerald-500 font-medium">
                      <i className="fa-solid fa-arrow-up"></i> +4.2%
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    สัดส่วนขยะที่ตามเส้นทางได้ต้นจนจบ
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">
                    KPI 2: Recycling Recovery
                  </span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-emerald-600">22.8%</span>
                    <span className="text-xs text-emerald-500 font-medium">
                      <i className="fa-solid fa-arrow-up"></i> +1.5%
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">ขยะที่เข้าสู่การรีไซเคิลจริง</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">
                    KPI 3: Waste Leakage Rate
                  </span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-rose-600">12.3%</span>
                    <span className="text-xs text-rose-500 font-medium">
                      <i className="fa-solid fa-arrow-down"></i> -2.1%
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    ขยะหรือข้อมูลที่สูญหายระหว่างทาง
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">
                    KPI 4: Data Completeness
                  </span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-blue-600">88.2%</span>
                    <span className="text-xs text-emerald-500 font-medium">
                      <i className="fa-solid fa-check"></i> ผ่านเกณฑ์
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">ความครบถ้วนสมบูรณ์ของชุดข้อมูล</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex flex-col justify-between">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider">
                    KPI 5: Recycling Opportunity
                  </span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-bold text-amber-600">68/100</span>
                    <span className="text-xs text-slate-500 font-medium">ระดับ: สูง</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    ดัชนีโอกาสขยายผลการลงทุนรีไซเคิล
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    <i className="fa-solid fa-chart-bar mr-1.5 text-emerald-500"></i>{' '}
                    สถิติปริมาณขยะจำแนกตามประเภท (ตัน/เดือน)
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut
                      data={edaTypesData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    <i className="fa-solid fa-users mr-1.5 text-blue-500"></i>{' '}
                    สัดส่วนขยะต่อประชากรรายพื้นที่นำร่อง (กิโลกรัม/คน/วัน)
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <Bar
                      data={edaPopData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                <h3 className="text-sm font-bold text-gray-700 mb-2">
                  ผังจำลองการไหลของขยะ (Waste Flow Visualizer)
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  แสดงการกระจายตัวตั้งแต่ แหล่งกำเนิด ➔ ทีมจัดเก็บ ➔ ปลายทางจัดเก็บ
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 text-center border-b pb-2">
                      1. แหล่งกำเนิด (Source)
                    </h4>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        หมู่บ้านจัดสรร (SRC-01)
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        45.2 ตัน
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        คอนโดมิเนียม (SRC-02)
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        30.1 ตัน
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        ตลาดสดนำร่อง (SRC-03)
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        18.5 ตัน
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 text-center border-b pb-2">
                      2. การจัดเก็บ & ขนส่ง
                    </h4>
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-800">
                        <i className="fa-solid fa-truck"></i> รถขนส่งเทศบาล
                      </span>
                      <span className="bg-emerald-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        81.5 ตัน
                      </span>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-amber-800">
                        <i className="fa-solid fa-store"></i> ร้านรับซื้อของเก่า/ซาเล้ง
                      </span>
                      <span className="bg-amber-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        12.3 ตัน
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2 text-center border-b pb-2">
                      3. ปลายทาง (Destination)
                    </h4>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        โรงไฟฟ้าขยะจังหวัด
                      </span>
                      <span className="bg-red-100 text-red-700 text-[11px] px-2 py-0.5 rounded-sm font-semibold">
                        60.2 ตัน
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-700">
                        โรงงานรีไซเคิลพันธมิตร
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 text-[11px] px-2 py-0.5 rounded-sm font-semibold">
                        21.3 ตัน
                      </span>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-rose-700">
                        <i className="fa-solid fa-triangle-exclamation"></i> ข้อมูลสูญหาย (Leakage)
                      </span>
                      <span className="bg-rose-600 text-white text-[11px] px-2 py-0.5 rounded-sm font-mono">
                        12.3 ตัน
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opportunity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    <i className="fa-solid fa-layer-group text-amber-500 mr-2"></i>
                    วิเคราะห์จัดกลุ่มพื้นที่นำร่อง (Clustering Analysis)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-gray-100">
                          <th className="p-3">ชื่อพื้นที่นำร่อง</th>
                          <th className="p-3">กลุ่ม (Cluster)</th>
                          <th className="p-3">ปริมาณขยะเฉลี่ย</th>
                          <th className="p-3">อัตรารีไซเคิลปัจจุบัน</th>
                          <th className="p-3 text-right">Recycling Opportunity Index</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        <tr>
                          <td className="p-3 text-gray-800 font-bold">ชุมชนหมู่บ้านจัดสรร A</td>
                          <td className="p-3">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm text-[11px]">
                              กลุ่ม 1: ขยะสูง-รีไซเคิลต่ำ
                            </span>
                          </td>
                          <td className="p-3">12.5 ตัน/สัปดาห์</td>
                          <td className="p-3 text-rose-500">8.2%</td>
                          <td className="p-3 text-right text-amber-600 font-bold">
                            88 / 100 <i className="fa-solid fa-arrow-trend-up ml-1"></i>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 text-gray-800 font-bold">คอนโดสุรวงศ์ พลาซ่า</td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-sm text-[11px]">
                              กลุ่ม 2: ขยะกลาง-รีไซเคิลดี
                            </span>
                          </td>
                          <td className="p-3">8.1 ตัน/สัปดาห์</td>
                          <td className="p-3 text-emerald-500">28.4%</td>
                          <td className="p-3 text-right text-slate-500 font-bold">45 / 100</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-gray-800 font-bold">ตลาดสดนนท์โมเดิร์น</td>
                          <td className="p-3">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-sm text-[11px]">
                              กลุ่ม 1: ขยะสูง-รีไซเคิลต่ำ
                            </span>
                          </td>
                          <td className="p-3">15.3 ตัน/สัปดาห์</td>
                          <td className="p-3 text-rose-500">4.1%</td>
                          <td className="p-3 text-right text-amber-600 font-bold">
                            92 / 100 <i className="fa-solid fa-arrow-trend-up ml-1"></i>
                          </td>
                        </tr>
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
                    <p className="text-xs text-gray-400 mb-4">
                      ประมวลผลผ่านโมเดล Gemini 2.5 Flash
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
                      <p>
                        💡 <b>เร่งด่วนที่สุด:</b> ควรจัดตั้งจุดรับซื้อขยะรีไซเคิลหรือธนาคารขยะใน{' '}
                        <b>ตลาดสดนนท์โมเดิร์น</b> เนื่องจากดัชนีโอกาสในการรีไซเคิลสูงถึง 92/100
                      </p>
                      <p>
                        💡 <b>เป้าหมายถัดไป:</b>{' '}
                        ชุมชนหมู่บ้านจัดสรร A มีขยะอินทรีย์ปนเปื้อนสูง หากทำโครงการถังหมักปุ๋ยจะลดขยะปลายทางได้กว่า 35%
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] text-gray-400 flex items-center justify-between">
                    <span>อัปเดตอิงตามโมเดลจับกลุ่มทางสถิติ</span>
                    <i className="fa-solid fa-robot"></i>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">
                    <i className="fa-solid fa-circle-check text-blue-500 mr-2"></i>
                    สถานะ Data Governance (ก่อนและหลัง Clean)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-600">
                          ตรวจสอบพบและลบชุดข้อมูลซ้ำซ้อน (Duplicates Deleted)
                        </span>
                        <span className="text-emerald-600 font-bold">
                          1,240 รายการ (100% Cleaned)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-600">
                          แก้ไขค่าที่ผิดปกติ/หลุดกรอบสถิติ (Outliers Handled)
                        </span>
                        <span className="text-emerald-600 font-bold">
                          84 รายการ (100% Cleaned)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-600">
                          จัดการค่าว่าง/ข้อมูลสูญหาย (Missing Values Filled)
                        </span>
                        <span className="text-amber-600 font-bold">
                          คงเหลือ 1.2% (อยู่ระหว่างตรวจสอบหน้างาน)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[98.8%]"></div>
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
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                        <p className="font-bold text-slate-700">เทศบาล</p>
                        <p className="text-gray-400 text-[11px]">ขยะรายวันเชิงพื้นที่</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                        <p className="font-bold text-slate-700">สสช. (สำนักงานสถิติ)</p>
                        <p className="text-gray-400 text-[11px]">จำนวนประชากรแฝง</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                        <p className="font-bold text-slate-700">กรมที่ดิน</p>
                        <p className="text-gray-400 text-[11px]">ขอบเขตและประเภทชุมชน</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-gray-100">
                        <p className="font-bold text-slate-700">อปท. / ผลสำรวจ</p>
                        <p className="text-gray-400 text-[11px]">พิกัดร้านรับซื้อของเก่า</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                <h3 className="text-sm font-bold text-gray-700 mb-4">
                  <i className="fa-solid fa-chart-line text-indigo-500 mr-2"></i>
                  พยากรณ์ปริมาณขยะรวมของจังหวัดในอนาคต (Predictive Modeling)
                </h3>
                <div className="h-80 w-full flex justify-center">
                  <Line
                    data={forecastModelData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
                <div className="mt-4 bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 flex items-start space-x-3">
                  <i className="fa-solid fa-circle-info mt-0.5 text-indigo-500 text-sm"></i>
                  <div>
                    <p className="font-bold">
                      สรุปผลจากแบบจำลองการคาดการณ์ (Statistical Forecast)
                    </p>
                    <p className="text-indigo-700 mt-1">
                      หากไม่มีมาตรการกระตุ้นการรีไซเคิลในระดับพื้นที่ คาดว่าปริมาณขยะรวมในพื้นที่นำร่องจะเติบโตเฉลี่ยปีละ 3.8%
                      โดยในระยะ 5 ปีข้างหน้า ปริมาณขยะจะสะสมสูงขึ้นจนเกินขีดความสามารถในการรองรับของสถานีขนถ่ายปัจจุบัน
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
