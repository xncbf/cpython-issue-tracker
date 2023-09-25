import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  Link,
  Hidden,
  Chip,
  Typography,
  Container,
  Box,
  FormControl,
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
import CommentIcon from '@mui/icons-material/Comment';
import { Issue, Label } from '../../types';
import { fetchIssues, fetchLabels } from '../../api';
import SearchField from './SearchField';
import LabelFilter from './LabelFilter';
import useInfiniteScroll from './useInfiniteScroll';
import useLocalStorage from './useLocalStorage';

type FiltersProps = {
  searchFilter: string;
  labelFilter: string[];
  labels: Label[];
  issueStatusFilter: 'ALL' | 'OPEN' | 'CLOSED';
  issueFilter: string;
  handleFilterChange: (event: any, key?: any) => void;
};

function Filters({
  searchFilter,
  labelFilter,
  labels,
  issueStatusFilter,
  issueFilter,
  handleFilterChange,
}: FiltersProps) {
  return (
    <Box sx={{ marginBottom: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          mb: 3,
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <SearchField value={searchFilter} onChange={handleFilterChange} />
        <FormControl variant="outlined" sx={{ flex: 1 }}>
          <LabelFilter
            labels={labels}
            value={labelFilter}
            onChange={handleFilterChange}
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
            value={issueStatusFilter}
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
    </Box>
  );
}

type IssueRowProps = {
  issue: Issue;
};

function IssueRow({ issue }: IssueRowProps) {
  return (
    <TableRow key={issue.id}>
      <TableCell>
        <Box display="flex" flexDirection="column">
          <Link
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="inherit"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">{issue.title}</Typography>
              {issue.labels &&
                issue.labels.map((label) => (
                  <Chip
                    key={label.id}
                    label={label.name}
                    sx={{
                      backgroundColor: `#${label.color}`,
                      color: '#000000',
                    }}
                    size="small"
                  />
                ))}
            </Box>
          </Link>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
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
                  <Typography variant="body2">{assignee.login}</Typography>
                </Box>
              ))}
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" justifyContent="center" alignItems="center">
            {issue.comments > 0 && (
              <>
                <CommentIcon sx={{ mr: 1 }} />
                <Typography variant="body2">{issue.comments}</Typography>
              </>
            )}
          </Box>
        </TableCell>
      </Hidden>
    </TableRow>
  );
}

type IssuesTableProps = {
  issues: Issue[];
};

function IssuesTable({ issues }: IssuesTableProps) {
  return (
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
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} />
        ))}
      </TableBody>
    </Table>
  );
}

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchFilter, setSearchFilter] = useLocalStorage<string>(
    'searchFilter',
    '',
  );
  const [labelFilter, setLabelFilter] = useLocalStorage<string[]>(
    'labelFilter',
    [],
  );
  const [issueFilter, setIssueFilter] = useLocalStorage<string>(
    'issueFilter',
    'ISSUE',
  );
  const [issueStatusFilter, setIssueStatusFilter] = useLocalStorage<
    'ALL' | 'OPEN' | 'CLOSED'
  >('issueStatusFilter', 'OPEN');
  const offsetRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const limit = 20;

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // 이전 요청 중단
    }

    const currentAbortController = new AbortController();
    abortControllerRef.current = currentAbortController; // 현재의 AbortController를 추적

    try {
      const issuesData = await fetchIssues(
        limit,
        offsetRef.current,
        searchFilter,
        labelFilter,
        issueFilter,
        issueStatusFilter,
        currentAbortController,
      );

      setIssues((prevIssues) => [...prevIssues, ...issuesData.items]);

      if (issuesData.items.length > 0) {
        offsetRef.current += limit;
      }

      const labelsData = await fetchLabels();
      setLabels(labelsData.items);
    } catch (error: any) {
      if (error.name === 'CanceledError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching data:', error);
      }
    }
  }, [limit, searchFilter, labelFilter, issueFilter, issueStatusFilter]);
  const throttledFetchData = useMemo(
    () =>
      _.throttle(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 1 <
          document.documentElement.offsetHeight
        )
          return;

        fetchData();
      }, 100),
    [fetchData],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useInfiniteScroll(throttledFetchData);

  const handleFilterChange = (event: any | string, key?: any) => {
    let name: string;
    let value: any;

    if (typeof event === 'string') {
      name = event;
      value = key;
    } else {
      name = event.target.name;
      value = event.target.value;
    }

    // console.log(newValue)
    switch (name) {
      case 'search':
        setSearchFilter(value);
        break;
      case 'is_issue':
        setIssueFilter(value);
        break;
      case 'status':
        setIssueStatusFilter(value);
        break;
      case 'labels':
        if (value)
          setLabelFilter(value.map((label: Label) => label.id.toString()));
        break;
      default:
        break;
    }
    offsetRef.current = 0;
    setIssues([]);
  };
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          CPython Issues
        </Typography>
        <Filters
          searchFilter={searchFilter}
          handleFilterChange={handleFilterChange}
          labelFilter={labelFilter}
          labels={labels}
          issueStatusFilter={issueStatusFilter}
          issueFilter={issueFilter}
        />
        <IssuesTable issues={issues} />
      </Box>
    </Container>
  );
}

export default IssueList;
