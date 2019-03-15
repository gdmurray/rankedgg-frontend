import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './app/App';

require('dotenv').config();

render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
