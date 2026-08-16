const textContentTypes = new Set([
  'application/csp-report',
  'application/graphql',
  'application/json',
  'application/javascript',
  'application/x-www-form-urlencoded',
  'application/x-ndjson',
  'application/xml',
]);

function shouldBase64Encode(contentType) {
  if (!contentType) return true;

  const normalized = contentType.split(';', 1)[0].toLowerCase();
  return !(
    normalized.startsWith('text/') ||
    normalized.endsWith('+json') ||
    normalized.endsWith('+xml') ||
    textContentTypes.has(normalized)
  );
}

async function buildEventFromRequest(request) {
  const url = new URL(request.url);
  const queryStringParameters = {};
  const multiValueQueryStringParameters = {};

  url.searchParams.forEach((value, key) => {
    queryStringParameters[key] = value;
    multiValueQueryStringParameters[key] = [
      ...(multiValueQueryStringParameters[key] || []),
      value,
    ];
  });

  const headers = {};
  const multiValueHeaders = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
    multiValueHeaders[key] = value.split(',').map((part) => part.trim());
  });

  const contentType = request.headers.get('content-type') || '';
  const isBinary = shouldBase64Encode(contentType);
  let body = null;
  let isBase64Encoded = false;

  if (request.body) {
    if (isBinary) {
      body = Buffer.from(await request.arrayBuffer()).toString('base64');
      isBase64Encoded = true;
    } else {
      body = await request.text();
    }
  }

  return {
    rawUrl: url.toString(),
    rawQuery: url.search.replace(/^\?/, ''),
    path: url.pathname,
    httpMethod: request.method,
    headers,
    multiValueHeaders,
    queryStringParameters: Object.keys(queryStringParameters).length
      ? queryStringParameters
      : null,
    multiValueQueryStringParameters:
      Object.keys(multiValueQueryStringParameters).length
        ? multiValueQueryStringParameters
        : null,
    body,
    isBase64Encoded,
  };
}

function buildLambdaContext(context) {
  return {
    awsRequestId: context.requestId,
    callbackWaitsForEmptyEventLoop: true,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: () => 0,
    done: () => {
      throw new Error('context.done() is not supported in Netlify Functions');
    },
    fail: () => {
      throw new Error('context.fail() is not supported in Netlify Functions');
    },
    succeed: () => {
      throw new Error('context.succeed() is not supported in Netlify Functions');
    },
  };
}

function buildResponseFromResult(result) {
  const headers = new Headers();

  for (const [name, value] of Object.entries(result.headers || {})) {
    headers.set(name.toLowerCase(), String(value));
  }

  for (const [name, values] of Object.entries(result.multiValueHeaders || {})) {
    for (const value of values) {
      headers.append(name.toLowerCase(), String(value));
    }
  }

  let body = null;
  if (result.body != null) {
    body = result.isBase64Encoded
      ? Buffer.from(result.body, 'base64')
      : result.body;
  }

  return new Response(body, {
    status: result.statusCode,
    headers,
  });
}

// Keeps existing Lambda-style handlers on the modern Netlify Functions runtime.
export function withLambda(handler) {
  return async (request, context) => {
    const event = await buildEventFromRequest(request);
    const lambdaContext = buildLambdaContext(context);
    const result = await handler(event, lambdaContext);
    return buildResponseFromResult(result);
  };
}
