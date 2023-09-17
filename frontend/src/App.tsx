import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Switch 대신 Routes를 사용
import IssueList from './IssueList';
import IssueDetail from './IssueDetail';

function App() {
  const [stars, setStars] = useState(0);
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/xncbf/cpython-issue-tracker');
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error('Error fetching star count:', error);
      }
    };

    fetchStars();
  }, []);
  return (
    <Router>
      <div>
        <div className="github-star-display">
          <a href="https://github.com/xncbf/cpython-issue-tracker" target="_blank" rel="noopener noreferrer">
            ⭐ {stars} Stars
          </a>
        </div>
        <Routes>
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/" element={<IssueList />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;
