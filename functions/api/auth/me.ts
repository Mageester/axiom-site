export async function onRequestGet(context: { data?: any }) {
    if (!context.data || !context.data.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { username, role, must_change_password } = context.data.user;

    return new Response(JSON.stringify({
        user: { username, role, must_change_password: !!must_change_password }
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
