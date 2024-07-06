import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './App';
import history from './history';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router history={history}>
    <App />
  </Router>
);
