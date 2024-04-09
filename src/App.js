import './css/App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import BaseRouter from './routes'
function App() {
  return (
    <BrowserRouter>
      <BaseRouter />
    </BrowserRouter>
  );
}
export default App;