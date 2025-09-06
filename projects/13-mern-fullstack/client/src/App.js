import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get('/api/health');
        setHealth(response.data);
      } catch (error) {
        console.error('Error fetching health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>MERN Stack Demo</h1>
        {loading ? (
          <p>Loading...</p>
        ) : health ? (
          <div>
            <p>Status: {health.status}</p>
            <p>Server Time: {health.timestamp}</p>
          </div>
        ) : (
          <p>Error connecting to server</p>
        )}
      </header>
    </div>
  );
}

export default App;
