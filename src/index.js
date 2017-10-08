import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './Components/App';
import Navbar from './Components/layout/Navbar/Navbar';

ReactDOM.render(
  <div>
    <Navbar />
    <App />
  </div>, document.getElementById('root'));
