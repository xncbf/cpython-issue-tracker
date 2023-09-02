import httpx
import os
import django
django.setup()

from app.models import Issue, User, Label  # 앞서 정의한 Django 모델 임포트

GITHUB_API_URL = "https://api.github.com/repos/python/cpython/issues"
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}"
}

def fetch_all_issues():
    page = 1
    with httpx.Client() as client:
        while True:
            response = client.get(GITHUB_API_URL, headers=HEADERS, params={'page': page, 'per_page': 100})
            if response.status_code != 200:
                print(response.status_code, response.text)
                break

            issues = response.json()
            if not issues:
                break

            for issue_data in issues:
                print(issue_data)
                return
                user_data = issue_data["user"]
                user, _ = User.objects.get_or_create(
                    id=user_data["id"],
                    defaults={
                        "data_json": user_data
                    }
                )

                issue, _ = Issue.objects.get_or_create(
                    id=issue_data["id"],
                    defaults={
                        "data_json": issue_data
                    }
                )

                for label_data in issue_data["labels"]:
                    label, _ = Label.objects.get_or_create(
                        id=label_data["id"],
                        defaults={
                            "data_json": label_data
                        }
                    )
                    issue.labels.add(label)

            page += 1


if __name__ == "__main__":
    fetch_all_issues()
