const args = process.argv.slice(2);

function argValue(name, fallback) {
  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index >= 0 && args[index + 1]) return args[index + 1];
  return fallback;
}

const baseUrl = argValue('base', process.env.INTAKE_BASE_URL || 'http://127.0.0.1:10000');
const origin = argValue('origin', process.env.INTAKE_ORIGIN || 'http://127.0.0.1:5173');
const expected = argValue('expect', process.env.INTAKE_EXPECT || 'service_unavailable');

const allowedExpectations = new Set(['success', 'service_unavailable', 'delivery_failed']);
if (!allowedExpectations.has(expected)) {
  console.error(`[intake-smoke] Unsupported --expect value: "${expected}"`);
  process.exit(1);
}

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, init);
  const raw = await response.text();
  let json = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    json = null;
  }
  return { status: response.status, raw, json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function logStep(name, result) {
  const body = result.json ?? result.raw ?? '';
  console.log(`[intake-smoke] ${name}: status=${result.status} body=${typeof body === 'string' ? body : JSON.stringify(body)}`);
}

async function run() {
  console.log(`[intake-smoke] base=${baseUrl} origin=${origin} expect=${expected}`);

  const preflight = await request('/api/intake', {
    method: 'OPTIONS',
    headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' },
  });
  logStep('preflight', preflight);
  assert(preflight.status === 204, 'Expected OPTIONS /api/intake to return 204');

  const invalidPayload = await request('/api/intake', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: 'A',
      email: 'bad-email',
      details: 'short',
    }),
  });
  logStep('invalid_payload', invalidPayload);
  assert(invalidPayload.status === 400, 'Expected invalid payload to return 400');

  const honeypotPayload = await request('/api/intake', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: 'Smoke Test User',
      email: 'smoke.test@example.com',
      details: 'Smoke test details for honeypot verification path.',
      company_fax: 'bot-value',
    }),
  });
  logStep('honeypot', honeypotPayload);
  assert(honeypotPayload.status === 200 && honeypotPayload.json?.ok === true, 'Expected honeypot submission to return 200 {ok:true}');

  const validPayload = await request('/api/intake', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: 'Smoke Test User',
      email: 'smoke.test@example.com',
      business_name: 'Smoke Test Mechanical',
      phone: '226-555-0100',
      current_website: 'https://example.com',
      project_scale: 'foundation',
      pain_points: ['Looks worse than my competitors'],
      details: 'Need a cleaner trust presentation and clearer inquiry flow before spring season.',
      source_path: '/apply',
    }),
  });
  logStep('valid_payload', validPayload);

  if (expected === 'success') {
    assert(validPayload.status === 200 && validPayload.json?.ok === true, 'Expected valid payload to return 200 {ok:true}');
    console.log('[intake-smoke] success path reached. Verify internal and confirmation emails in inbox/Resend logs.');
  }

  if (expected === 'service_unavailable') {
    assert(validPayload.status === 503, 'Expected 503 when RESEND_API_KEY is not configured');
  }

  if (expected === 'delivery_failed') {
    assert(validPayload.status === 502, 'Expected 502 when email delivery fails');
  }

  console.log('[intake-smoke] completed successfully');
}

run().catch((error) => {
  console.error(`[intake-smoke] FAILED: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
