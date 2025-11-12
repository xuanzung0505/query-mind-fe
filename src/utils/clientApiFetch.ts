"use client";

import { redirect } from "next/navigation";

/**
 * Client fetching with additional headers such as authorization, which server fetching doesn't have
 */
async function clientApiFetch<T>(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  // Check for 401 Unauthorized status
  if (response.status === 401) {
    console.warn("401 Unauthorized - Redirecting to sign-in...");
    redirect("/sign-in");
  }
  // Handle other HTTP errors (e.g., 500, 400, etc.)
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})); // Handle non-JSON responses
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`
    );
  }
  return response.json() as Promise<T>;
}

export { clientApiFetch };
