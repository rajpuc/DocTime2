import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/progress.css';
import './assets/css/sidebar.css';
import './assets/css/dropdownmenu.css';
import './assets/css/style.css';
import './assets/css/prescription.css';
import { Provider } from 'react-redux';
import store from './Redux/Store/Store.jsx';
import {Toaster} from "react-hot-toast";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>  
      <App />
    </Provider>
    <Toaster position="bottom-center"/>
  </StrictMode>,
)
