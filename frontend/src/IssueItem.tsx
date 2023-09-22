import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue } from './types';

interface IssueItemProps {
  issue: Issue;
}

function IssueItem({ issue }: IssueItemProps) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/issue/${issue.id}`);
  };

  return (
    <div onClick={goToDetail}>
      <h2>{issue.title}</h2>
      {/* 다른 이슈 정보도 여기에 표시할 수 있습니다. */}
    </div>
  );
}

export default IssueItem;
