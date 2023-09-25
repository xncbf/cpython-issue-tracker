import asyncio
import os

import django
import httpx

django.setup()

from app.models import Issue, Label, User  # noqa

GITHUB_API_URL = "https://api.github.com/repos/python/cpython/issues"
HEADERS = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
}

MAX_CONCURRENT_REQUESTS = 20


async def fetch_issues_for_page(page, session):
    response = await session.get(
        GITHUB_API_URL + "?filter=all&state=all",
        headers=HEADERS,
        params={"page": page, "per_page": 100},
    )
    if response.status_code != 200:
        print(response.status_code, response.text)
        return []

    return response.json()


async def fetch_all_issues_async():
    page = 1

    async with httpx.AsyncClient() as client:
        while True:
            tasks = []
            print(page)
            for _ in range(MAX_CONCURRENT_REQUESTS):
                tasks.append(fetch_issues_for_page(page, client))
                page += 1

            pages_data = await asyncio.gather(*tasks)
            if all(not data for data in pages_data):
                break

            for issues in pages_data:
                if not issues:
                    print("No issues")
                    continue
                for issue_data in issues:
                    labels = issue_data.pop("labels")
                    assignee = issue_data.pop("assignee", None)
                    if assignee:
                        user, _ = await User.objects.aget_or_create(id=assignee.pop("id"), defaults=assignee)
                        issue_data["assignee"] = user
                    assignees = issue_data.pop("assignees", None)
                    pull_request = issue_data.pop("pull_request", None)
                    if pull_request:
                        issue_data["is_issue"] = False
                    user = issue_data.pop("user")
                    user, _ = await User.objects.aget_or_create(id=user.pop("id"), defaults=user)
                    issue_data["user"] = user

                    issue, _ = await Issue.objects.aget_or_create(id=issue_data.pop("id"), defaults=issue_data)
                    if assignees:
                        assignees_set = set()
                        for assignee in assignees:
                            user, _ = await User.objects.aget_or_create(id=assignee.pop("id"), defaults=assignee)
                            assignees_set.add(user)

                        await issue.assignees.aset(assignees_set)

                    labels = [await Label.objects.aget(id=label["id"]) for label in labels]
                    await issue.labels.aset(labels)


def fetch_all_labels():
    with httpx.Client() as client:
        response = client.get(
            "https://api.github.com/repos/python/cpython/labels",
            headers=HEADERS,
            params={"per_page": 100},
        )
        if response.status_code != 200:
            print(response.status_code, response.text)

        labels = response.json()

        for label_data in labels:
            label, _ = Label.objects.get_or_create(id=label_data.pop("id"), defaults=label_data)


if __name__ == "__main__":
    fetch_all_labels()
    asyncio.run(fetch_all_issues_async())
