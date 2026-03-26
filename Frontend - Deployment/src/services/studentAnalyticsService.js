import {
  mockLearningInsightsResponse,
  mockPerformanceTrendResponse,
  mockStudentDashboardSummaryResponse,
} from "../mockdata/studentAnalyticsMockData";

// These service wrappers intentionally mirror the future API boundaries:
// dashboard summary for home, insights for detail cards, and trend for charts.
export async function getDashboardSummary() {
  return Promise.resolve(mockStudentDashboardSummaryResponse);
}

// Get learning insights.
export async function getLearningInsights() {
  return Promise.resolve(mockLearningInsightsResponse);
}

// Get performance trend.
export async function getPerformanceTrend() {
  return Promise.resolve(mockPerformanceTrendResponse);
}
