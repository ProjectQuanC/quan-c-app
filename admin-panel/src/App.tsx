import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageRouter from './routes/PageRouter';

function App() {
  return (
    <div className="App">
      <Router>
        <PageRouter />
      </Router>
    </div>
  );
}

export default App;
