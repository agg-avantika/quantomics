import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import 'react-notifications/lib/notifications.css';
import App from './app';

ReactDOM.render(<BrowserRouter><App/></BrowserRouter>,document.getElementById('root'));
