const configuredApiUrl = import.meta.env.VITE_BASE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error(
    'VITE_BASE_API_URL is missing. Add it to client/.env for local development or to Vercel and redeploy the client.'
  );
}

export const BASE_URL = configuredApiUrl.replace(/\/+$/, '');
