import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Typography, Container, Box } from '@mui/material';
import _ from 'lodash';
import { Issue, Label, User } from '../../types';
import { fetchIssues, fetchLabels, fetchUsers } from '../../api';
import IssuesTable from './IssuesTable';
import Filters from './Filters';
import useInfiniteScroll from './useInfiniteScroll';
import useLocalStorage from './useLocalStorage';

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [authors, setAuthors] = useState<User[]>([]);
  const [searchFilter, setSearchFilter] = useLocalStorage<string>(
    'searchFilter',
    '',
  );
  const [authorFilter, setAuthorFilter] = useLocalStorage<string>(
    'authorFilter',
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

      const authorsData = await fetchUsers();
      setAuthors(authorsData.items);
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
      case 'author':
        setAuthorFilter(value);
        break;
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
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
          <Box sx={{ flexBasis: '20%', flexShrink: 0 }}>
            <Filters
              searchFilter={searchFilter}
              authorFilter={authorFilter}
              authors={authors}
              handleFilterChange={handleFilterChange}
              labelFilter={labelFilter}
              labels={labels}
              issueStatusFilter={issueStatusFilter}
              issueFilter={issueFilter}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <IssuesTable issues={issues} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default IssueList;
