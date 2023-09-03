import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';
import { Issue } from './types';  // 상대 경로를 바탕으로 Issue 타입을 가져옵니다.

function IssueDetail() {
    const [issue, setIssue] = useState<Issue | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        // 선택된 이슈의 상세 정보를 API 호출을 통해 가져옵니다.
        fetch(`/api/issues/${id}/`)
            .then(response => response.json())
            .then(data => setIssue(data));
    }, [id]);

    if (!issue) return <div>Loading...</div>;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{issue.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                    {issue.body}
                </Typography>
                {/* 추가적으로 다른 필드들도 표시할 수 있습니다. */}
            </CardContent>
        </Card>
    );
}

export default IssueDetail;
