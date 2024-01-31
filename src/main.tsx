import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import configureStore from "./store";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';


const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  (window as any).store = store;
}


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
