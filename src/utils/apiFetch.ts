import { redirect } from "next/navigation";
/**
 * A centralized utility to make API calls and handle global errors like 401.
 */
async function serverApiFetch(url: string, options = {}) {
  const response = await fetch(url, options);
  // Check for 401 Unauthorized status
  if (response.status === 401) {
    console.warn("401 Unauthorized - Redirecting to sign-in...");
    redirect("/");
  }
  // Handle other HTTP errors (e.g., 500, 400, etc.)
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})); // Handle non-JSON responses
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

export { serverApiFetch };
