import {
  mockFaqsResponse,
  mockSupportSubmitResponse,
} from "../mockdata/helpMockData";

// Keep the service signature aligned with the planned backend contract so the
// component layer does not change when mock data is replaced with real fetches.
export async function getFaqs() {
  return Promise.resolve(mockFaqsResponse);
}

// Submit support request.
export async function submitSupportRequest(payload) {
  return Promise.resolve({
    ...mockSupportSubmitResponse,
    data: {
      ...mockSupportSubmitResponse.data,
      subject: payload.subject,
      message: payload.message,
    },
  });
}
