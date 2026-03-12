BRANCH STRUCTURE
The repository has two main branches. Everyone must follow this structure at all times:

- main -- The stable, fully working version of the system. NEVER push directly here.
- test -- The shared working branch. ALL teammates push their changes here first.

IMPORTANT RULE: No one is allowed to push directly to main. All changes must go through test first and be verified before merging into main.

DAILY WORKFLOW
Follow these steps EVERY TIME you work on the project.

Step 1 -- Always Pull Before You Start
Before making any changes, always get the latest version from the test branch:

```
git checkout test
git pull origin test
```

NEVER skip this step. If you skip it, your code may be outdated and cause conflicts when you push.

Step 2 -- Make Your Changes
Now you can edit your files -- write your code, fix bugs, update configs, etc.

Step 3 -- Check What You Changed
Before staging, check which files you modified:

```
git status
```

Green files = staged (ready to commit). Red files = modified but not staged yet.

Step 4 -- Stage Your Changes
Stage all your changed files:

```
git add .
```

Or stage a specific file only:

```
git add filename.ext
```

Step 5 -- Commit Your Changes
Save your staged changes with a clear descriptive message:

```
git commit -m "Brief description of what you changed"
```

Commit Message Examples by Role:
- Project Manager: "Updated sprint plan and risk assessment"
- Backend: "Added dashboard subjects API endpoint"
- Frontend: "Implemented dark mode toggle in header"
- Deployment: "Fixed CORS wildcard config for mobile"
- Documentation: "Updated setup guide for v2.0.0"
- Tester/QA: "Added test cases for registration validation"

Step 6 -- Push to the test Branch
Upload your committed changes to the test branch on GitHub:

```
git push origin test
```

After pushing, notify your teammates in your group chat so they know to pull the latest changes before they start working.