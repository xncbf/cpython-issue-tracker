import React from 'react';
import './App.css';
import IssueList from './IssueList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CPython Issues</h1>
        <IssueList />
      </header>
    </div>
  );
}

export default App;
