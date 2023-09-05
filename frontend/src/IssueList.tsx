import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    List, ListItem, ListItemText, ListItemAvatar, Typography, 
    Container, Box, Divider, Avatar, ListItemButton, TextField
} from '@mui/material';
import axios from 'axios';
import { Issue, IssueAPIResponse } from './types';

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState('');
    const offsetRef = useRef(0); // 여기에 추가
    const limit = 20; // 원하는 limit 값
    const abortController = new AbortController();

    useEffect(() => {
        fetchIssues();
        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);
        return () => {
            // cleanup
            window.removeEventListener('scroll', handleScroll);
        };
    }, [filter]);

    const fetchIssues = async () => {
        const currentOffset = offsetRef.current;
        try {
            const apiUrl = `http://localhost:8000/api/issues/?limit=${limit}&offset=${currentOffset}${filter ? `&title=${filter}` : ''}`;
            const response = await axios.get<IssueAPIResponse>(apiUrl);
            setIssues(prevIssues => [...prevIssues, ...response.data.items]);
    
            if (response.data.items.length > 0) { 
                offsetRef.current += limit;
            }
    
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };
    

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        fetchIssues();
    }, [offsetRef, filter]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchKeyword = event.target.value;
        setFilter(searchKeyword);
    
        // 검색 키워드가 변경될 때 offset과 이슈 목록 초기화
        offsetRef.current = 0;
        setIssues([]);
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
            </Box>
        </Container>
    );
}

export default IssueList;
