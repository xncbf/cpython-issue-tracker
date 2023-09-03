import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Switch 대신 Routes를 사용
import IssueList from './IssueList';
import IssueDetail from './IssueDetail';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/" element={<IssueList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
