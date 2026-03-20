import { useNavigate } from "react-router-dom";

const actions = [
  {
    id: "subjects",
    label: "Go to Subjects",
    description: "Return to the dashboard subjects list.",
    path: "/student-dashboard",
  },
  {
    id: "results",
    label: "View Results",
    description: "Open your most recent quiz results page.",
    path: "/practice-exam-result",
  },
  {
    id: "leaderboard",
    label: "Open Leaderboard",
    description: "Check the leaderboard standings.",
    path: "/leaderboard",
  },
];

// Render the guided actions panel component.
const GuidedActionsPanel = ({ onNavigate }) => {
  const navigate = useNavigate();

  // Handle action.
  const handleAction = (path) => {
    onNavigate?.();
    navigate(path);
  };

  return (
    <div className="grid gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={() => handleAction(action.path)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-[var(--color-bg-secondary)] dark:hover:bg-[var(--color-bg-tertiary)]"
        >
          <div className="text-[14px] font-semibold text-gray-800 dark:text-white">
            {action.label}
          </div>
          <div className="mt-1 text-[12px] text-gray-500 dark:text-gray-300">
            {action.description}
          </div>
        </button>
      ))}
    </div>
  );
};

export default GuidedActionsPanel;
