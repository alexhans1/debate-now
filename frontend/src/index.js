import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './Components/App';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>, document.getElementById('root'));
