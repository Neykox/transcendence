import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Home from './components/home';
import Page1 from './components/page1';
import Page2 from './components/page2';
import NotFound from './components/notFound'


const router = createBrowserRouter([
{ path: '/', element: <Home />},
{ path: '/page1', element: <Page1 />},
{ path: '/page2', element: <Page2 />},
{ path: '*', element: <NotFound />}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/*<App />*/}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
