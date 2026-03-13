Recovered frontend files extracted from dangling Git blobs after the aborted merge.

These files are non-destructive copies. Your current working files were not overwritten.

Confirmed recovered blobs:
- `Frontend - Deployment/src/components/BottomNav.recovered.jsx`
  - blob `06f4556c9384072a1c587c8418d49cd570180649`
- `Frontend - Deployment/src/components/DashboardCarousel.recovered.jsx`
  - blob `607da95b906b37ed6619d8503ff1bdbeadaf6b3b`
- `Frontend - Deployment/src/components/layout.recovered.jsx`
  - blob `c9741c9d5f89dcf4f8b86483076e3a9ea25df976`
- `Frontend - Deployment/src/pages/Leaderboard.recovered.jsx`
  - blob `2cb8467a8540dae694ef7245f701881c47ae54f1`
- `Frontend - Deployment/src/pages/StudentDashboard.recovered.jsx`
  - blob `d02dc46d82b1d2c2b1fd609bf491c70d639a8e4e`
- `Frontend - Deployment/src/App.recovered.jsx`
  - blob `6b47695c5453450a0ec70c7b4585aaeead42db12`

Files that still appear to differ from the recovered copies:
- `Frontend - Deployment/src/components/BottomNav.jsx`
- `Frontend - Deployment/src/components/DashboardCarousel.jsx`
- `Frontend - Deployment/src/pages/Leaderboard.jsx`
- `Frontend - Deployment/src/pages/StudentDashboard.jsx`

Not fully mapped yet:
- `Frontend - Deployment/src/components/StudentSubjectCard.jsx`
- any additional frontend files that may still exist only as unnamed dangling blobs

Recommended next step:
- diff each `.recovered.jsx` file against the current working file and merge back only the missing parts.
