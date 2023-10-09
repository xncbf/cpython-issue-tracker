import axios from 'axios';
import { IssueAPIResponse, LabelAPIResponse, UserAPIResponse } from './types';

export const fetchIssues = async (
  limit: number,
  offset: number,
  filter: string,
  authorFilter: string,
  labelFilter: string[],
  issueFilter: string,
  issueStatusFilter: 'ALL' | 'OPEN' | 'CLOSED',
  abortController: AbortController,
): Promise<IssueAPIResponse> => {
  let apiUrl = `http://localhost:8000/api/issues/?limit=${limit}&offset=${offset}`;

  apiUrl += filter ? `&search=${filter}` : '';

  if (authorFilter !== '') {
    apiUrl += authorFilter ? `&user_id=${authorFilter}` : '';
  }

  if (labelFilter.length > 0) {
    apiUrl += '&' + labelFilter.map((label) => `labels=${label}`).join('&');
  }

  if (issueFilter !== 'ALL') {
    const isIssue = issueFilter === 'ISSUE' ? true : false;
    apiUrl += issueFilter ? `&is_issue=${isIssue}` : '';
  }

  if (issueStatusFilter !== 'ALL') {
    const is_open = issueStatusFilter === 'CLOSED' ? false : true;
    apiUrl += issueStatusFilter ? `&is_open=${is_open}` : '';
  }

  const response = await axios.get<IssueAPIResponse>(apiUrl, {
    signal: abortController.signal,
  });

  return response.data;
};

export const fetchLabels = async (): Promise<LabelAPIResponse> => {
  const response = await axios.get<LabelAPIResponse>(
    'http://localhost:8000/api/labels/',
  );
  return response.data;
};
export const fetchUsers = async (
  query: string = '',
): Promise<UserAPIResponse> => {
  const response = await axios.get<UserAPIResponse>(
    'http://localhost:8000/api/users/',
    {
      params: {
        search: query,
      },
    },
  );
  return response.data;
};
