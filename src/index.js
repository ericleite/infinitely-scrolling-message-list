// Libs
import React from 'react';
import ReactDOM from 'react-dom';

// Components
import App from './components/App/App';

// Utils
import registerServiceWorker from './registerServiceWorker';

// CSS
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
