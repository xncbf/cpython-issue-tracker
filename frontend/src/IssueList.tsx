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

    const fetchIssues = async (isSearch: boolean = false) => {
        const currentOffset = offsetRef.current;
        const apiUrl = `http://localhost:8000/api/issues/?limit=${limit}&offset=${currentOffset}${filter ? `&title=${filter}` : ''}`;
        
        if (isSearch) {
            // 검색 요청이면 이전 요청을 취소
            abortController.abort();
        }
    
        try {
            const response = await axios.get<IssueAPIResponse>(apiUrl, {
                signal: abortController.signal
            });
            setIssues(prevIssues => [...prevIssues, ...response.data.items]);
    
            if (response.data.items.length > 0) {
                offsetRef.current += limit;
            }
        } catch (error) {
            if (error instanceof Error) {
                // 요청이 사용자에 의해 취소되었을 경우만 오류를 무시합니다.
                if (error.name === 'CanceledError') return;
                console.error("Error fetching issues:", error.message);
            } else {
                console.error("An unexpected error occurred:", error);
            }
        }
    };
    

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        fetchIssues();
    }, [offsetRef, filter]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchKeyword = event.target.value;
        setFilter(searchKeyword);
        offsetRef.current = 0;
        setIssues([]);
    
        fetchIssues(true); // 검색 요청으로 처리
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
