// IssueRow.tsx
import React from 'react';
import {
  Link,
  Chip,
  Typography,
  Hidden,
  Box,
  TableCell,
  TableRow,
  Avatar,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { Issue } from '../../types';

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
            <Typography variant="body1">{issue.title}</Typography>
          </Link>

          <Box display="flex" alignItems="center" gap={1} mt={1}>
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

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
          >
            #{issue.number} opened {issue.created_at.toString()} by{' '}
            {issue.user.type === 'Mannequin' ? (
              <span style={{ color: 'gray', fontStyle: 'italic' }}>
                Mannequin
              </span>
            ) : (
              <Link
                href={`https://github.com/${issue.user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="inherit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={issue.user.avatar_url}
                  alt={`${issue.user.login}'s avatar`}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    marginLeft: '5px',
                  }}
                />
                {issue.user.login}
              </Link>
            )}
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

export default IssueRow;
