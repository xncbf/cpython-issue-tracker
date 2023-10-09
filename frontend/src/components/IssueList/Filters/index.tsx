// Filters.tsx
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchField from './SearchField';
import AuthorFilter from './AuthorFilter';
import LabelFilter from './LabelFilter';
import { Label, User } from '../../../types';

type FiltersProps = {
  searchFilter: string;
  authorFilter: string;
  authors: User[];
  setAuthors: (authors: User[]) => void;
  labelFilter: string[];
  labels: Label[];
  issueStatusFilter: 'ALL' | 'OPEN' | 'CLOSED';
  issueFilter: string;
  handleFilterChange: (event: any, key?: any) => void;
};

function Filters({
  searchFilter,
  authorFilter,
  authors,
  setAuthors,
  labelFilter,
  labels,
  issueStatusFilter,
  issueFilter,
  handleFilterChange,
}: FiltersProps) {
  return (
    <Box
      sx={{ marginBottom: 3, display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <SearchField value={searchFilter} onChange={handleFilterChange} />
      <AuthorFilter
        authors={authors}
        setAuthors={setAuthors}
        value={authorFilter}
        onChange={handleFilterChange}
      />
      <LabelFilter
        labels={labels}
        value={labelFilter}
        onChange={handleFilterChange}
      />

      <FormControl variant="outlined" fullWidth>
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

      <FormControl variant="outlined" fullWidth>
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
  );
}

export default Filters;
