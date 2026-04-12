import { z } from 'zod';
import {
    onRequestOptions as intakeOptions,
    onRequestPost as intakePost
} from './intake';

const ContactPayloadSchema = z.object({
    name: z.string().trim().min(2, 'Name is required').max(80),
    email: z.string().trim().email('Valid email is required').max(160),
    business_name: z.string().trim().max(120).optional(),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(4000),
    source_path: z.string().trim().max(200).optional()
}).strict();

export const onRequestPost: PagesFunction = async (context) => {
    const { request } = context;
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return new Response(JSON.stringify({ ok: false, error: 'Invalid Content-Type' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }

    const rawBody = await request.json().catch(() => null);
    if (!rawBody || typeof rawBody !== 'object') {
        return new Response(JSON.stringify({ ok: false, error: 'Malformed JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }

    const parsed = ContactPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
        return new Response(JSON.stringify({
            ok: false,
            error: 'Validation failed',
            details: parsed.error.issues[0]?.message || 'Invalid payload'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
    }

    const payload = {
        name: parsed.data.name,
        email: parsed.data.email,
        business_name: parsed.data.business_name || '',
        details: parsed.data.message,
        primary_goal: 'not_sure',
        source_path: parsed.data.source_path || '/contact'
    };

    const proxiedRequest = new Request(new URL('/api/intake', request.url), {
        method: 'POST',
        headers: request.headers,
        body: JSON.stringify(payload)
    });

    return intakePost({
        ...context,
        request: proxiedRequest
    });
};

export const onRequestOptions = intakeOptions;
