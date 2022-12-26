import React from 'react';
import ReactDOM from 'react-dom/client';
import Application from './ui';
import reportWebVitals from './report-web-vitals';

//    ***** CSS IMPORTS *******
import './assets/css/index.scss';

export const RootElement = document.getElementById('root') as HTMLElement;
export const ReactRoot = ReactDOM.createRoot(RootElement)

// STRICT MODE WILL INTENTIONALLY CALL USE_REDUCER AND USE_STATE's INITIAL METHODS MULTIPLE TIMES TO TEST THE PUTRIDITY OF SUCH
//  FUNCTIONS. IT ALSO CHECKS FOR THE PROBLEMS IN CONCURRENT MODE SO THE PERFORMANCE IS INTENTIONALLY WORSE. PLEASE BE AWARE!!!
// IF A DISPATCH OF A USE REDUCER THROWS, THE DISPATCHER AUTOMATICALLY RECALLS THE DISPATCH IN HOPE THAT THE ERROR IS RESOLVED
ReactRoot.render(
    // <StrictMode>
    <Application/>
    // </StrictMode>
);

reportWebVitals();
