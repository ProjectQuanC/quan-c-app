import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import PageRouter from './routes/PageRouter';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <PageRouter />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
