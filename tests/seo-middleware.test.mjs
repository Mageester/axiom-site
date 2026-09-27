import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_middleware.ts';

test('all private responses, including slash variants and redirects, are noindex and uncacheable', async () => {
  for (const path of ['/admin/login', '/admin/', '/admin-shell/', '/account/', '/dashboard', '/lead/42/', '/leads/', '/campaigns', '/hunt/', '/vault/', '/triage/', '/settings/', '/jobs/', '/api', '/api/auth/me', '/functions/', '/functions/private']) {
    for (const status of [200, 302, 401, 403, 500]) {
      const result = await onRequest({ request: new Request('https://getaxiom.ca' + path), next: async () => new Response('private', { status, headers: { Location: '/admin/login' } }) });
      assert.equal(result.headers.get('X-Robots-Tag'), 'noindex, nofollow');
      assert.equal(result.headers.get('Cache-Control'), 'no-store');
      assert.equal(result.status, status);
      assert.equal(result.headers.get('Location'), '/admin/login');
      assert.equal(await result.text(), 'private');
    }
  }
});

test('marketing responses pass through; ops host stays private', async () => {
  for (const path of ['/', '/services/', '/web-design/kitchener/', '/accounting/']) {
    const response = new Response('public');
    assert.equal(await onRequest({ request: new Request('https://getaxiom.ca' + path), next: async () => response }), response);
  }
  const ops = await onRequest({ request: new Request('https://ops.getaxiom.ca/'), next: async () => new Response('ops') });
  assert.equal(ops.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});
