import { ArrowDownToLine, ArrowUpToLine, BanknoteArrowUp, ChartSpline, Circle, IndianRupee, Target, UsersRound } from 'lucide-react';
import RevenueChart from './components/Chart/ChartBarMultiple';
import type { CategorySales, RegionalSales, RevenueData } from '@/types/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RegionalSalesChart from './components/Chart/RegionalSalesChart';
import CategorySalesChart from './components/Chart/CategorySalesChart';
interface TABINTERFACE {
    id: number,
    name: string,
    tab: string
}
export default function AdminDashboard() {

    const revenueData: RevenueData[] = [
        { month: 'Jan', revenue: 1850000, target: 2000000 },
        { month: 'Feb', revenue: 2200000, target: 2100000 },
        { month: 'Mar', revenue: 1950000, target: 2200000 },
        { month: 'Apr', revenue: 2450000, target: 2300000 },
        { month: 'May', revenue: 2800000, target: 2400000 },
        { month: 'Jun', revenue: 2650000, target: 2500000 },
    ];

    const BottomTab: TABINTERFACE[] = [
        {
            id: 1,
            name: "Open Tasks",
            tab: "open-tasks"
        },
        {
            id: 2,
            name: "Order Pipeline",
            tab: "order-pipeline"
        },
        {
            id: 3,
            name: "Regional Sales",
            tab: "regional-sales"
        },
        {
            id: 4,
            name: "Sales by Category",
            tab: "sales-by-category"
        },
    ];
    const regionalSales: RegionalSales[] = [
        { region: 'North', sales: 8500000, target: 8000000 },
        { region: 'South', sales: 7200000, target: 7500000 },
        { region: 'East', sales: 4500000, target: 5000000 },
        { region: 'West', sales: 6800000, target: 6500000 },
    ];
    const categorySales: CategorySales[] = [
        { category: 'Ambient', value: 45 },
        { category: 'Effluent', value: 30 },
        { category: 'Emission', value: 15 },
        { category: 'RTWQMS', value: 10 },
    ];
    return (
        <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <button id="mobileMenuToggle" className="lg:hidden text-gray-600">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
                            <span className="live-badge px-2 py-1 rounded-full text-xs font-medium text-white bg-green-500">
                                LIVE
                            </span>
                        </div>
                        <p className="text-gray-600 mt-1">Welcome back, Sanjay Sir</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-filter text-gray-500"></i>
                        <select id="timeFilter" className="border rounded-lg px-3 py-2 text-sm bg-white">
                            <option value="realtime">Real-time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        <select id="regionFilter" className="border rounded-lg px-3 py-2 text-sm bg-white">
                            <option value="all">All Regions</option>
                            <option value="north">North</option>
                            <option value="south">South</option>
                            <option value="east">East</option>
                            <option value="west">West</option>
                        </select>
                    </div>
                    <button className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
                        Export Report
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" id="kpiContainer">
                <div className="kpi-card bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue (YTD)</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">₹2.08 Cr</p>
                            <div className="flex items-center mt-1 text-sm font-medium text-red-600">
                                <ArrowDownToLine size={16} />
                                8.7% decrease
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                            <IndianRupee />
                        </div>
                    </div>
                </div>

                <div className="kpi-card bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">46.9%</p>
                            <div className="flex items-center mt-1 text-sm font-medium text-red-600">
                                <ArrowDownToLine size={16} />
                                2.2% decrease
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                            <ChartSpline />
                        </div>
                    </div>
                </div>

                <div className="kpi-card bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cash Flow</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">₹79.0 L</p>
                            <div className="flex items-center mt-1 text-sm font-medium text-green-600">
                                <ArrowUpToLine size={16} />
                                8.7% increase
                            </div>
                        </div>
                        <div className="bg-red-100 text-red-600 p-3 rounded-full">
                            <BanknoteArrowUp />
                        </div>
                    </div>
                </div>

                <div className="kpi-card bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Leads</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
                            <div className="flex items-center mt-1 text-sm font-medium text-red-600">
                                <ArrowDownToLine size={16} />
                                16.1% decrease
                            </div>
                        </div>
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                            <UsersRound />
                        </div>
                    </div>
                </div>

                <div className="kpi-card bg-white rounded-xl border border-gray-200 px-4 py-3 hover:shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">35.1%</p>
                            <div className="flex items-center mt-1 text-sm font-medium text-green-600">
                                <i className="fas fa-arrow-up mr-1"></i>
                                6.0% increase
                            </div>
                        </div>
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                            <Target />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Monthly Revenue vs Target</h3>
                            <p className="text-gray-600">Live YTD performance</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                            <Circle size={13} fill='#16a34a' />
                            <span className="text-sm font-medium">Live</span>
                        </div>
                    </div>
                    <div className="relative h-80">
                        <RevenueChart data={revenueData} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Sales Funnel Health</h3>
                        <div className="flex items-center gap-2 text-green-600">
                            <Circle size={13} fill='#16a34a' />
                            <span className="text-sm font-medium">Live</span>
                        </div>
                    </div>
                    <div id="funnelContainer" className="space-y-6">
                        <div className="funnel-bar">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">New Inquiry</span>
                                <span className="text-gray-600">147 (100%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "100%" }}></div>
                            </div>
                        </div>

                        <div className="funnel-bar">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">Pre-Site Visit</span>
                                <span className="text-gray-600">89 (60.5%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "60.5%" }}></div>
                            </div>
                        </div>

                        <div className="funnel-bar">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">Quote Sent</span>
                                <span className="text-gray-600">67 (45.6%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "45.6%" }}></div>
                            </div>
                        </div>

                        <div className="funnel-bar">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">PO Received</span>
                                <span className="text-gray-600">52 (35.4%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "35.4%" }}></div>
                            </div>
                        </div>

                        <div className="funnel-bar">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium">Project Completed</span>
                                <span className="text-gray-600">45 (30.6%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-600 h-3 rounded-full" style={{ width: "30.6%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <Tabs defaultValue="open-tasks">
                    <TabsList className='flex overflow-x-auto mb-6 bg-white rounded-lg border border-gray-200 p-1 w-full h-auto'>
                        {
                            BottomTab.map((item) => (
                                <TabsTrigger key={item.id} className='tab-btn flex-1 whitespace-nowrap px-4 py-2 h-auto text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 ' value={item.tab}>{item.name}</TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <TabsContent value="open-tasks">
                        <div className="tab-content active">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="tasksContainer">
                                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-gray-900">Sales</h4>
                                        <span
                                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            high
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Pending Quotes for Approval</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900">12</span>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-gray-900">Service</h4>
                                        <span
                                            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <i className="fas fa-clock"></i>
                                            medium
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Upcoming Site Visits</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900">8</span>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-gray-900">Procurement</h4>
                                        <span
                                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            high
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Delayed Deliveries</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900">5</span>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-gray-900">Accounts</h4>
                                        <span
                                            className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            high
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">Overdue Payments</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900">15</span>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="order-pipeline">
                        <div className="tab-content">
                            <div className="space-y-4" id="pipelineContainer">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="font-mono text-sm text-gray-500">LD-001</span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                Quote Pending
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900">ABC Chemicals</h4>
                                        <p className="text-sm text-gray-600">₹12,50,000 • 2 days open</p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        View →
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="font-mono text-sm text-gray-500">LD-002</span>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                                PO Received
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900">XYZ Pharma</h4>
                                        <p className="text-sm text-gray-600">₹8,50,000 • 5 days open</p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        View →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="regional-sales">
                        <div className="tab-content">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="h-80">
                                    <RegionalSalesChart data={regionalSales} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="sales-by-category">
                        <div className="tab-content">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="h-80">
                                    <CategorySalesChart data={categorySales} />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <div className="flex items-center gap-2 text-green-600">
                        <i className="fas fa-circle text-xs"></i>
                        <span className="text-sm font-medium">Live Feed</span>
                    </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div className="flex items-center gap-3 p-2 rounded-lg ">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">Site visit completed for XYZ Industries</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:22 AM</span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg ">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">Purchase order received from Metal Works Ltd</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:17 AM</span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg ">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">Site visit completed for XYZ Industries</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:16 AM</span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg ">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">Service request created for Chemical Plant</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:15 AM</span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg ">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">Purchase order received from Metal Works Ltd</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:14 AM</span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm font-medium text-yellow-800">Site visit completed for XYZ Industries</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:13 AM</span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg ">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">Quote approved for Green Enviro Solutions</span>
                        </div>
                        <span className="text-xs text-gray-500">10:17:12 AM</span>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500 text-sm mt-8">
                <p>Vepolink ERP Live Executive Dashboard • <span id="lastUpdate">Last updated: 10:19:17 AM</span></p>

            </div>
        </div>
    )
}