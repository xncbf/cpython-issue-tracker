import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Hidden,
  Chip,
  Typography,
  Container,
  Box,
  Divider,
  ListItemButton,
  TextField,
  FormControl,
  Autocomplete,
  InputLabel,
  Select,
  Avatar,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import _ from 'lodash';
import axios from 'axios';
import { Issue, IssueAPIResponse, Label, LabelAPIResponse } from './types';
import CommentIcon from '@mui/icons-material/Comment';

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setSearchFilter] = useState('');
  const [labels, setLabels] = useState<Label[]>([]);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const [issueFilter, setIssueFilter] = useState('ISSUE');
  const [issueStatus, setIssueStatus] = useState<'ALL' | 'OPEN' | 'CLOSED'>(
    'OPEN',
  );

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
  }, [filter, labelFilter, issueFilter, issueStatus]);
  const handleScroll = useCallback(
    _.throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 <
        document.documentElement.offsetHeight
      )
        return;
      fetchIssues();
    }, 100),
    [offsetRef, filter],
  );

  const fetchIssues = async (isSearch = false) => {
    let apiUrl = `http://localhost:8000/api/issues/?limit=${limit}&offset=${offsetRef.current}`;
    apiUrl += filter ? `&search=${filter}` : '';
    if (labelFilter.length > 0) {
      apiUrl += '&' + labelFilter.map((label) => `labels=${label}`).join('&');
    }
    if (issueFilter !== 'ALL') {
      const isIssue = issueFilter === 'ISSUE' ? true : false;
      apiUrl += issueFilter ? `&is_issue=${isIssue}` : '';
    }
    if (issueStatus !== 'ALL') {
      const is_open = issueStatus === 'CLOSED' ? false : true;
      apiUrl += issueStatus ? `&is_open=${is_open}` : '';
    }
    if (isSearch) {
      abortController.abort();
    }

    try {
      const response = await axios.get<IssueAPIResponse>(apiUrl, {
        signal: abortController.signal,
      });
      setIssues((prevIssues) => [...prevIssues, ...response.data.items]);
      if (response.data.items.length > 0) {
        offsetRef.current += limit;
      }
    } catch (error) {
      if (error instanceof Error) {
        // 요청이 사용자에 의해 취소되었을 경우만 오류를 무시합니다.
        if (error.name === 'CanceledError') return;
        console.error('Error fetching issues:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await axios.get<LabelAPIResponse>(
        'http://localhost:8000/api/labels/',
      );
      setLabels(response.data.items);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const handleAutocompleteChange = (event: any, newValue: readonly Label[]) => {
    setLabelFilter(newValue.map((label) => label.id.toString()));
    offsetRef.current = 0;
    setIssues([]);
    fetchIssues(true);
  };
  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    switch (name) {
      case 'search':
        setSearchFilter(value);
        break;
      case 'is_issue':
        setIssueFilter(value);
        break;
      case 'status':
        setIssueStatus(value);
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            mb: 3,
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <TextField
            name="search"
            label="Search by title and body"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            sx={{ flex: 1 }}
          />
          <FormControl variant="outlined" sx={{ flex: 1 }}>
            <Autocomplete
              multiple
              id="labels-autocomplete"
              options={labels}
              getOptionLabel={(option) => option.name}
              value={labels.filter((label) =>
                labelFilter.includes(label.id.toString()),
              )}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search labels..."
                  name="labels"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </FormControl>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            mb: 3,
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <FormControl variant="outlined" sx={{ flex: 1 }}>
            <InputLabel id="issue-status-label">status</InputLabel>
            <Select
              labelId="issue-status-label"
              id="issue-status"
              value={issueStatus}
              label="status"
              name="status"
              onChange={handleFilterChange}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ flex: 1 }}>
            <InputLabel id="issue-type-filter-label">Type</InputLabel>
            <Select
              labelId="issue-type-filter-label"
              id="issue-type-filter"
              value={issueFilter}
              label="issue-type"
              onChange={handleFilterChange}
              name="is_issue"
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="ISSUE">Issue</MenuItem>
              <MenuItem value="PULL REQUEST">Pull Request</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Issue</TableCell>
              <Hidden smDown>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Assignees
                </TableCell>
                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Comments
                </TableCell>
              </Hidden>
            </TableRow>
          </TableHead>

          <TableBody>
            {issues.map((issue, index) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <ListItemText
                      primary={
                        <>
                          {issue.title}
                          {issue.labels &&
                            issue.labels.map((label) => (
                              <Chip
                                key={label.id}
                                label={label.name}
                                sx={{
                                  ml: 1,
                                  backgroundColor: `#${label.color}`,
                                  color: '#000000',
                                }}
                                size="small"
                              />
                            ))}
                        </>
                      }
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      #{issue.number} opened {issue.created_at.toString()} by{' '}
                      {issue.user.login}
                    </Typography>
                  </Box>
                </TableCell>
                <Hidden smDown>
                <TableCell>
                <Box display="flex" justifyContent="center" alignItems="center">
                    {issue.assignees &&
                      issue.assignees.map((assignee) => (
                        <Box
                          key={assignee.id}
                          display="flex"
                          alignItems="center"
                          sx={{ mr: 2 }}
                        >
                          <Avatar
                            src={assignee.avatar_url}
                            alt={assignee.login}
                            sx={{ width: 24, height: 24, mr: 0.5 }}
                          />
                          <Typography variant="body2">
                            {assignee.login}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    {issue.comments > 0 && (
                      <>
                        <CommentIcon sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {issue.comments}
                        </Typography>
                      </>
                    )}
                  </Box>
                </TableCell>
                </Hidden>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}

export default IssueList;
