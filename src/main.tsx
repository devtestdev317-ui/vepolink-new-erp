import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import { store } from './App/store.ts';
import { routes } from './route/routeConfig.tsx';
import { Toaster } from './components/ui/sonner.tsx';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster position='top-right' richColors closeButton />
  </Provider>
);