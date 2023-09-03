import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Issue = {
    id: number;
    title: string;
    // 필요한 다른 필드를 추가하세요.
};

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get<Issue[]>('http://127.0.0.1:8000/api/issues')
            .then(response => {
                setIssues(response.data);
                setFilteredIssues(response.data);
            });
    }, []);

    useEffect(() => {
        setFilteredIssues(
            issues.filter(issue =>
                issue.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, issues]);

    return (
        <div>
            <input
                type="text"
                placeholder="Filter issues..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredIssues.map(issue => (
                    <li key={issue.id}>{issue.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default IssueList;
