BRANCH STRUCTURE
We use two main branches. Follow this at all times:

- main -- Stable, production-ready code. Do not push directly.
- test -- Shared working branch. Everyone pushes here first.

Rule: No one pushes directly to main. All changes must go to test first, be checked, then merged to main.

DAILY WORKFLOW
Do these steps every time you work on the project.

# Step 1 -- Pull the latest test branch
Before making changes, make sure you are on test and up to date:

```
git checkout test
git pull origin test
```

Skipping this can cause conflicts or outdated code.

# Step 2 -- Make your changes
Edit files, write code, fix bugs, update configs, etc.

# Step 3 -- Review your changes
Check what files you modified:

```
git status
```

# Green files are staged. Red files are modified but not staged.

# Step 4 -- Stage your changes
Stage everything:

```
git add .
```

Or stage one file:

```
git add filename.ext
```

# Step 5 -- Commit with a clear message
Save your staged changes:

```
git commit -m "Brief description of what you changed"
```

Commit message examples by role:
- Project Manager: "Updated sprint plan and risk assessment"
- Backend: "Added dashboard subjects API endpoint"
- Frontend: "Implemented dark mode toggle in header"
- Deployment: "Fixed CORS wildcard config for mobile"
- Documentation: "Updated setup guide for v2.0.0"
- Tester/QA: "Added test cases for registration validation"

# Step 6 -- Push to test
Upload your commit to the test branch:

```
git push origin test
```

# After pushing, tell the team in the group chat so they can pull the latest changes.
