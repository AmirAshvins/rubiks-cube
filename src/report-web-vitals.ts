import {ReportHandler} from 'web-vitals';

/**
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 * @param onPerfEntry
 */
const reportWebVitals = (onPerfEntry?: ReportHandler | undefined) => {
  if (!onPerfEntry || typeof onPerfEntry !== 'function') return;
  import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  });
};

export default reportWebVitals;
