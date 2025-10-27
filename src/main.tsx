import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FrontLayout from './layout/Front-Layout.tsx';
import DashboardLayout from './layout/Dashboard-layout.tsx';
import Dashboard from './dashboard/page.tsx';
import RouteError from './components/RouteError.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { store } from './App/store.ts';
import { Provider } from "react-redux"
import AddNewLeadPage from './dashboard/leads/add-new/page.tsx';
import ViewLeadDetailPage from './dashboard/leads/view/page.tsx';
import { Toaster } from "@/components/ui/sonner";
import UpdateLeadPage from './dashboard/leads/update/page.tsx';
import ListLeadsPage from './dashboard/list-leads/page.tsx';
import InspectionListPage from './dashboard/leads/Inspection-List/page.tsx';
import QuoteApprovelPage from './dashboard/leads/approvel/ApprovelListing.tsx';
import ApprovelList from './dashboard/leads/approvel/list/page.tsx';
import MasterPage from './master-page/page.tsx';
import MasterLayout from './layout/Master-layout.tsx';
import RecruitmentPage from './dashboard/human-resources/add-requirement/page.tsx';
import EmployeeManagementPage from './dashboard/human-resources/add-requirement/employees/page.tsx';
import AttendancePage from './dashboard/human-resources/add-requirement/attendance/page.tsx';
import PayrollPage from './dashboard/payroll/page.tsx';
import VendorPage from './dashboard/vendor/add-vendor/page.tsx';
import VendorListPage from './dashboard/vendor/page.tsx';
import VendorDetail from './dashboard/vendor/view/page.tsx';
import UpdateVendor from './dashboard/vendor/update/page.tsx';
import PerformanceManagementPage from './dashboard/performance/page.tsx';
const Routes = createBrowserRouter([
  {
    path: "/",
    element: <FrontLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <App />
      }
    ]
  },
  {
    path: "/master",
    element: <MasterLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <MasterPage />,
      },
    ]
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "lead",
        element: <ListLeadsPage />,
      },
      {
        path: "leads",
        element: <ListLeadsPage />,
      },
      {
        path: "leads/view/:id",
        element: <ViewLeadDetailPage />,
      },
      {
        path: "leads/update/:id",
        element: <UpdateLeadPage />,
      },
      {
        path: "leads/add",
        element: <AddNewLeadPage />,
      },
      {
        path: "leads/inspection",
        element: <InspectionListPage />,
      },
      // {
      //   path: "sales-manager/leads",
      //   element: <SalesManagerLeadsPage />,
      // },

      // Approvel
      {
        path: "leads/approvel",
        element: <QuoteApprovelPage />,
      },
      {
        path: "leads/approvel/list/",
        element: <ApprovelList />,
      },
      // HR
      {
        path: "human-resources/add-requisition/",
        element: <RecruitmentPage />
      },
      {
        path: "human-resources/employee-management/",
        element: <EmployeeManagementPage />
      },
      // Attendenc
      {
        path: "attendance/",
        element: <AttendancePage />
      },
      {
        path: "payroll",
        element: <PayrollPage />
      },
      // Vendor
      {
        path: 'vendor/add-new',
        element: <VendorPage />
      },
      {
        path: 'vendor/list',
        element: <VendorListPage />
      },
      {
        path: 'vendor/view/:id',
        element: <VendorDetail />
      },
      {
        path: 'vendor/update/:id',
        element: <UpdateVendor />
      },
      {
        path: 'performance',
        element: <PerformanceManagementPage />
      },
    ],
  },
])

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={Routes} />
        <Toaster position='top-right' richColors closeButton />
      </ErrorBoundary>

    </Provider>
  </StrictMode>,
)