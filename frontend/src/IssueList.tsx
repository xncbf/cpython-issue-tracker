import React, { useEffect, useState } from 'react';
import {
    List, ListItem, ListItemText, ListItemAvatar, Typography, Button, 
    Container, Box, Divider, Avatar, ListItemButton, TextField
} from '@mui/material';
import axios from 'axios';
import { Issue, IssueAPIResponse } from './types';

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState('');
    const [nextPage, setNextPage] = useState<string | null>(null);

    useEffect(() => {
        fetchIssues('http://localhost:8000/api/issues/');
    }, []);

    const fetchIssues = async (url: string, filterValue: string = '') => {
        try {
            let apiUrl = url;
            if (filterValue) {
                apiUrl += `?title=${filterValue}`; // API가 title 쿼리 파라미터를 지원한다고 가정
            }

            const response = await axios.get<IssueAPIResponse>(apiUrl);
            setIssues(response.data.items);
            setNextPage(response.data.next);
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);
        fetchIssues('http://localhost:8000/api/issues/', value);
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Issue List
                </Typography>
                {/* Filter Input */}
                <Box my={2}>
                    <TextField
                        label="Filter by title"
                        variant="outlined"
                        fullWidth
                        value={filter}
                        onChange={handleFilterChange}
                    />
                </Box>
                <List>
                    {issues.map((issue, index) => (
                        <React.Fragment key={issue.id}>
                            <ListItem>
                                <ListItemButton component="a" href={issue.html_url} target="_blank" rel="noopener noreferrer">
                                    <ListItemAvatar>
                                        <Avatar>{issue.id}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={issue.title} />
                                </ListItemButton>
                            </ListItem>
                            {index !== issues.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
                {nextPage && (
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" color="primary" onClick={() => fetchIssues(nextPage, filter)}>
                            Load More
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default IssueList;
