import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Box, Paper, Button } from '@mui/material';
import axios from 'axios';
import { Issue } from './types';

function IssueDetail() {
    const { id } = useParams<{ id: string }>();
    const [issue, setIssue] = useState<Issue | null>(null);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                const response = await axios.get<Issue>(`http://localhost:8000/api/issues/${id}`);
                setIssue(response.data);
            } catch (error) {
                console.error("Error fetching the issue:", error);
            }
        };
        fetchIssue();
    }, [id]);

    if (!issue) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    {issue.title}
                </Typography>
                <Paper elevation={3} style={{ padding: '16px' }}>
                    <Typography variant="body1">{issue.body}</Typography>
                </Paper>
                <Box mt={2}>
                    <Button variant="contained" color="primary" href={issue.html_url} target="_blank">
                        View on GitHub
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default IssueDetail;
