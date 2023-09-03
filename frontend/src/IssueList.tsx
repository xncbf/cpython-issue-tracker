import React, { useState, useEffect } from 'react';
import axios from 'axios';

type IssueAPIResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    items: Issue[];
};
type Issue = {
    id: number;
    title: string;
    updated_at: Date;
    draft: boolean | null;
    comments_url: string;
    comments: number;
    html_url: string;
    closed_at: Date | null;
    repository_url: string;
    timeline_url: string;
    state: string;
    reactions: {};
    performed_via_github_app: string | null;
    assignee: {} | null;
    created_at: Date;
    state_reason: string | null;
    body: string | null;
    locked: boolean;
    labels: [];
    milestone: string | null;
    labels_url: string;
    number: number;
    node_id: string;
    author_association: string;
    pull_request: {} | null;
    user: {};
    active_lock_reason: string | null;
    assignees: [];
    events_url: string;
    url: string;
};

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get<IssueAPIResponse>('http://127.0.0.1:8000/api/issues')
            .then(response => {
                setIssues(response.data.items);
                setFilteredIssues(response.data.items);
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
