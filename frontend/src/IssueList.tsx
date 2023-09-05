import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    List, ListItem, ListItemText, ListItemAvatar, Typography, 
    Container, Box, Divider, Avatar, ListItemButton, TextField,
    Select, MenuItem, FormControlLabel, FormControl, InputLabel, Grid
} from '@mui/material';
import axios from 'axios';
import { Issue, IssueAPIResponse } from './types';

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [labelFilter, setLabelFilter] = useState([]);
    const [createdDateFilter, setCreatedDateFilter] = useState(null);
    const [commentsFilter, setCommentsFilter] = useState(null);
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const [lockedFilter, setLockedFilter] = useState(null);
    const [draftFilter, setDraftFilter] = useState(null);
    
    const offsetRef = useRef(0);
    const limit = 20;
    const abortController = new AbortController();

    useEffect(() => {
        fetchIssues();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [filter, stateFilter, labelFilter, createdDateFilter, commentsFilter, assigneeFilter, lockedFilter, draftFilter]);

    const fetchIssues = async (isSearch = false) => {
        let apiUrl = `http://localhost:8000/api/issues/?limit=${limit}&offset=${offsetRef.current}`;
        apiUrl += filter ? `&title=${filter}` : '';
        apiUrl += stateFilter ? `&state=${stateFilter}` : '';
        apiUrl += labelFilter.length > 0 ? `&labels=${labelFilter.join(',')}` : '';
        apiUrl += createdDateFilter ? `&created_at=${createdDateFilter}` : '';
        apiUrl += commentsFilter ? `&comments=${commentsFilter}` : '';
        apiUrl += assigneeFilter ? `&assignee=${assigneeFilter}` : '';
        apiUrl += lockedFilter !== null ? `&locked=${lockedFilter}` : '';
        apiUrl += draftFilter !== null ? `&draft=${draftFilter}` : '';

        if (isSearch) {
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

    const handleFilterChange = (event: any) => {
        const { name, value } = event.target;
        switch(name) {
            case 'title':
                setFilter(value);
                break;
            case 'state':
                setStateFilter(value);
                break;
            case 'labels':
                setLabelFilter(value);
                break;
            case 'createdDate':
                setCreatedDateFilter(value);
                break;
            case 'comments':
                setCommentsFilter(value);
                break;
            case 'assignee':
                setAssigneeFilter(value);
                break;
            case 'locked':
                setLockedFilter(value);
                break;
            case 'draft':
                setDraftFilter(value);
                break;
            default:
                break;
        }
        offsetRef.current = 0;
        setIssues([]);
        fetchIssues(true);
    };
    
    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Cpython Issues
                </Typography>
    
                <Grid container spacing={3}>
                    {/* 필터링 부분 */}
                    <Grid item xs={12} md={4}>
                        <Box my={2}>
                            <TextField
                                name="title"
                                label="Filter by title"
                                variant="outlined"
                                fullWidth
                                value={filter}
                                onChange={handleFilterChange}
                            />
                        </Box>
    
                        <Box my={2}>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="state"
                                    value={stateFilter}
                                    onChange={handleFilterChange}
                                    label="Status"
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
    
                        <Box my={2}>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel>Labels</InputLabel>
                                <Select
                                    name="labels"
                                    multiple
                                    value={labelFilter}
                                    onChange={handleFilterChange}
                                    label="Labels"
                                >
                                    {["bug", "enhancement", "documentation"].map(label => (
                                        <MenuItem key={label} value={label}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
    
                        {/* ... 여기에 필요한 다른 필터 컴포넌트를 추가하세요. */}
                    </Grid>
    
                    {/* 이슈 목록 부분 */}
                    <Grid item xs={12} md={8}>
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
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
    
}

export default IssueList;
