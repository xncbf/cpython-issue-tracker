import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Button, Container, Box } from '@mui/material';
import axios from 'axios';
import { Issue, IssueAPIResponse } from './types';

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [nextPage, setNextPage] = useState<string | null>(null);

    useEffect(() => {
        fetchIssues('http://localhost:8000/api/issues/');
    }, []);

    const fetchIssues = async (url: string) => {
        try {
            const response = await axios.get<IssueAPIResponse>(url);
            setIssues(response.data.items);
            setNextPage(response.data.next);
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Issue List
                </Typography>
                <List>
                    {issues.map(issue => (
                        <ListItem key={issue.id} component={Link} to={`/issues/${issue.id}`} button>
                            <ListItemText primary={issue.title} />
                        </ListItem>
                    ))}
                </List>
                {nextPage && (
                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={() => fetchIssues(nextPage)}>
                            Load More
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default IssueList;
