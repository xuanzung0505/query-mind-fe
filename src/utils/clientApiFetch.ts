"use client";

/**
 * Client fetching with additional headers such as authorization, which server fetching doesn't have
 */
async function clientApiFetch<T>(url: string, options: RequestInit) {
  const response = await fetch(url, options);
  // Check for 401 Unauthorized status
  if (response.status === 401) {
    console.warn("401 Unauthorized - Redirecting to sign-in...");
    if (typeof window !== "undefined") {
      // Use a client-side navigation method here since this utility runs in the browser
      window.location.assign("/sign-in");
      // Throw to stop further processing; navigation will replace the page.
      throw new Error("Redirecting to sign-in");
    }
    // If somehow executed on the server, throw a clear error
    throw new Error("Unauthorized: redirect to /sign-in required");
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
