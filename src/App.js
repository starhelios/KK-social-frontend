import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import Routes from './Routes';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './redux/configureStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='App'>
      <Provider store={store()}>
        <ConnectedRouter history={history}>
          <>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
            <ToastContainer position='top-center' />
          </>
        </ConnectedRouter>
      </Provider>
    </div>
  );
}

export default App;
