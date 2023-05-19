import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { FirebaseAppProvider } from 'reactfire';
import firebaseConfig from './helpers/firebaseConfig';
import React from 'react';
import ErrorHandler from './components/atomic/ErrorHandler';

const App = React.lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <BrowserRouter>
        <ErrorHandler>
          <App />
        </ErrorHandler>
      </BrowserRouter>
    </FirebaseAppProvider>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
