import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import App from '@/App'
import AdminLayout from '@/layout/Admin-Layout'
import AdminDashboard from '@/admin/Dashboard'
// ============================================
// LAZY LOADED LAYOUTS
// ============================================
const FrontLayout = lazy(() => import('../layout/Front-Layout'))
const DashboardLayout = lazy(() => import('../layout/Dashboard-layout'))


// ============================================
// LAZY LOADED PAGES - DASHBOARD
// ============================================
const Dashboard = lazy(() => import('../dashboard/page'))

// Lead Routes
const ListLeadsPage = lazy(() => import('../dashboard/list-leads/page'))
const AddNewLeadPage = lazy(() => import('../dashboard/leads/add-new/page'))
const ViewLeadDetailPage = lazy(() => import('../dashboard/leads/view/page'))
const UpdateLeadPage = lazy(() => import('../dashboard/leads/update/page'))
const InspectionListPage = lazy(() => import('../dashboard/leads/Inspection-List/page'))

// Approval Routes
const QuoteApprovelPage = lazy(() => import('../dashboard/leads/approvel/ApprovelListing'))
const ApprovelList = lazy(() => import('../dashboard/leads/approvel/list/page'))

// HR Routes
const RecruitmentPage = lazy(() => import('../dashboard/human-resources/add-requirement/page'))
const EmployeeManagementPage = lazy(() => import('../dashboard/human-resources/add-requirement/employees/page'))
const AttendancePage = lazy(() => import('../dashboard/human-resources/add-requirement/attendance/page'))

// Vendor Routes
const VendorPage = lazy(() => import('../dashboard/vendor/add-vendor/page'))
const VendorListPage = lazy(() => import('../dashboard/vendor/page'))
const VendorDetail = lazy(() => import('../dashboard/vendor/view/page'))
const UpdateVendor = lazy(() => import('../dashboard/vendor/update/page'))

// Other Routes
const PayrollPage = lazy(() => import('../dashboard/payroll/page'))
const PerformanceManagementPage = lazy(() => import('../dashboard/performance/page'))
const TrainingPage = lazy(() => import('../dashboard/training/page'))
const PolicyManagementPage = lazy(() => import('../dashboard/policy-management/page'))
const EmployeeEngagementPage = lazy(() => import('../dashboard/employee-engagement/page'))

// Master Page
const MasterPage = lazy(() => import('../master-page/page'))

// Error & UI Components
const RouteError = lazy(() => import('../components/RouteError'))
// ============================================
// LOADING FALLBACK COMPONENT
// ============================================
const PageLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" >
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mb-4" >
        </div>
        <p className="text-gray-600 font-medium" > Loading...</p>
    </div>
)

// ============================================
// WRAPPER FOR LAZY COMPONENTS
// ============================================
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={< PageLoader />}> {children} </Suspense>
)

// ============================================
// ROUTE CONFIGURATION
// ============================================
export const routes: RouteObject[] = [
    // ============================================
    // HOME / FRONT LAYOUT ROUTES
    // ============================================
    {
        path: '/',
        element: <LazyWrapper><FrontLayout /></LazyWrapper >,
        errorElement: <LazyWrapper><RouteError /></LazyWrapper >,
        children: [
            {
                index: true,
                element: <LazyWrapper><App /></LazyWrapper >,
            },
        ],
    },

    // ============================================
    // ADMIN LAYOUT ROUTES
    // ============================================
    {
        path: '/admin',
        element: <LazyWrapper><AdminLayout /></LazyWrapper>,
        errorElement: <LazyWrapper><RouteError /></LazyWrapper >,
        children: [
            {
                index: true,
                element: <LazyWrapper><AdminDashboard /></LazyWrapper >,
            }
        ]
    },

    // ============================================
    // DASHBOARD LAYOUT & ALL DASHBOARD ROUTES
    // ============================================
    {
        path: '/dashboard',
        element: <LazyWrapper><DashboardLayout /></LazyWrapper >,
        errorElement: <LazyWrapper><RouteError /></LazyWrapper >,
        children: [
            // Dashboard Index
            {
                index: true,
                element: <LazyWrapper><Dashboard /></LazyWrapper >,
            },
            {
                path: "master",
                element: <LazyWrapper><MasterPage /></LazyWrapper >,
            },
            {
                path: 'attendance',
                element: <LazyWrapper><AttendancePage /></LazyWrapper >,
            },

            // -------- LEAD ROUTES --------
            {
                path: 'leads',
                children: [
                    {
                        index: true,
                        element: <LazyWrapper><ListLeadsPage /></LazyWrapper >,
                    },
                    {
                        path: 'add',
                        element: <LazyWrapper><AddNewLeadPage /></LazyWrapper >,
                    },
                    {
                        path: 'view/:id',
                        element: <LazyWrapper><ViewLeadDetailPage /></LazyWrapper >,
                    },
                    {
                        path: 'update/:id',
                        element: <LazyWrapper><UpdateLeadPage /></LazyWrapper >,
                    },
                    {
                        path: 'inspection',
                        element: <LazyWrapper><InspectionListPage /></LazyWrapper >,
                    },
                ],
            },

            // -------- APPROVAL ROUTES --------
            {
                path: 'leads/approvel',
                children: [
                    {
                        index: true,
                        element: <LazyWrapper><QuoteApprovelPage /></LazyWrapper >,
                    },
                    {
                        path: 'list',
                        element: <LazyWrapper><ApprovelList /></LazyWrapper >,
                    },
                ],
            },

            // -------- HR ROUTES --------
            {
                path: 'human-resources',
                children: [
                    {
                        path: 'add-requisition',
                        element: <LazyWrapper><RecruitmentPage /></LazyWrapper >,
                    },
                    {
                        path: 'employee-management',
                        element: <LazyWrapper><EmployeeManagementPage /></LazyWrapper >,
                    },

                ],
            },

            // -------- VENDOR ROUTES --------
            {
                path: 'vendor',
                children: [
                    {
                        index: true,
                        element: <LazyWrapper><VendorListPage /></LazyWrapper >,
                    },
                    {
                        path: 'add-new',
                        element: <LazyWrapper><VendorPage /></LazyWrapper >,
                    },
                    {
                        path: 'view/:id',
                        element: <LazyWrapper><VendorDetail /></LazyWrapper >,
                    },
                    {
                        path: 'update/:id',
                        element: <LazyWrapper><UpdateVendor /></LazyWrapper >,
                    },
                ],
            },

            // -------- OTHER ROUTES --------

            {
                path: 'payroll',
                element: <LazyWrapper><PayrollPage /></LazyWrapper >,
            },
            {
                path: 'performance',
                element: <LazyWrapper><PerformanceManagementPage /></LazyWrapper >,
            },
            {
                path: 'training-development',
                element: <LazyWrapper><TrainingPage /></LazyWrapper >,
            },
            {
                path: 'policy-management',
                element: <LazyWrapper><PolicyManagementPage /></LazyWrapper >,
            },
            {
                path: 'employee-engagement',
                element: <LazyWrapper><EmployeeEngagementPage /></LazyWrapper >,
            },
        ],
    },


]
