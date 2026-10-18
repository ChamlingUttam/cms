import cors from 'cors';

const localFrontendOrigin = 'http://localhost:3000';

function parseFrontendOrigin(value: string, requireHttps: boolean) {
  const configuredValue = value.trim();
  let url: URL;

  try {
    url = new URL(configuredValue);
  } catch {
    throw new Error('FRONTEND_URL must be a valid frontend origin.');
  }

  if (
    (url.protocol !== 'https:' &&
      !(url.protocol === 'http:' && !requireHttps)) ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      requireHttps
        ? 'FRONTEND_URL must be an HTTPS origin without a path, query, or fragment.'
        : 'FRONTEND_URL must be an HTTP or HTTPS origin without a path, query, or fragment.',
    );
  }

  return url.origin;
}

function getAllowedOrigins() {
  const frontendUrl = process.env.FRONTEND_URL?.trim();

  if (process.env.NODE_ENV === 'production') {
    if (!frontendUrl) {
      throw new Error(
        'FRONTEND_URL must be set to the deployed frontend HTTPS origin in production.',
      );
    }

    return [parseFrontendOrigin(frontendUrl, true)];
  }

  return [
    localFrontendOrigin,
    ...(frontendUrl ? [parseFrontendOrigin(frontendUrl, false)] : []),
  ];
}

export function createCorsMiddleware() {
  const allowedOrigins = new Set(getAllowedOrigins());

  return cors({
    origin(origin, callback) {
      callback(null, !origin || allowedOrigins.has(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    optionsSuccessStatus: 204,
  });
}
