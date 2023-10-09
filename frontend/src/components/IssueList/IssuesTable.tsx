// IssuesTable.tsx
import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Hidden,
} from '@mui/material';
import IssueRow from './IssueRow';
import { Issue } from '../../types';

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

export default IssuesTable;
