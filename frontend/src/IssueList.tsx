import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    List, ListItem, ListItemText, ListItemAvatar, Typography, 
    Container, Box, Divider, Avatar, ListItemButton, TextField,
    Select, MenuItem, FormControlLabel, FormControl, InputLabel, Grid
} from '@mui/material';
import axios from 'axios';
import { Issue, IssueAPIResponse, Label, LabelAPIResponse } from './types';

function IssueList() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [labels, setLabels] = useState<Label[]>([]);
    const [labelFilter, setLabelFilter] = useState<string[]>([]);
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
        fetchLabels();
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

    const fetchLabels = async () => {
        try {
            const response = await axios.get<LabelAPIResponse>('http://localhost:8000/api/labels/');
            setLabels(response.data.items);
        } catch (error) {
            console.error("Error fetching labels:", error);
        }
    };
    const filteredLabels = labels.filter(label => labelFilter.includes(label.name));
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
                    CPython Issues
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    mb: 3,
                    justifyContent: 'space-between',
                    gap: 2
                }}>
                    <TextField
                        name="title"
                        label="Search by title"
                        variant="outlined"
                        value={filter}
                        onChange={handleFilterChange}
                        sx={{ flex: 2 }}
                    />
                    <FormControl variant="outlined" sx={{ flex: 1 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="state"
                            value={stateFilter}
                            onChange={handleFilterChange}
                            label="Status"
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ flex: 1 }}>
                        <InputLabel>Labels</InputLabel>
                        <Select
                            name="labels"
                            multiple
                            value={labelFilter}
                            onChange={handleFilterChange}
                            label="Labels"
                        >
                            {filteredLabels.map(label => (
                                <MenuItem key={label.id} value={label.id}>
                                    {label.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <List>
                    {issues.map((issue, index) => (
                        <React.Fragment key={issue.id}>
                            <ListItem disablePadding>
                                <ListItemButton 
                                    component="a" 
                                    href={issue.html_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}
                                >
                                    <Box display="flex" flexDirection="column">
                                        <ListItemText primary={issue.title} />
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>#{issue.number} opened {issue.created_at.toString()} by {issue.user.login}</Typography>
                                    </Box>
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
