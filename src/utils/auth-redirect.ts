export type LoginRedirectState = {
  from?: string;
  message?: string;
  email?: string;
};

export function buildLoginHref(state?: LoginRedirectState | null): string {
  const params = new URLSearchParams();
  if (state?.from) params.set("from", state.from);
  if (state?.message) params.set("message", state.message);
  if (state?.email) params.set("email", state.email);
  const query = params.toString();
  return query ? `/login?${query}` : "/login";
}

export function parseLoginRedirect(
  searchParams: URLSearchParams,
): LoginRedirectState {
  return {
    from: searchParams.get("from") ?? undefined,
    message: searchParams.get("message") ?? undefined,
    email: searchParams.get("email") ?? undefined,
  };
}
