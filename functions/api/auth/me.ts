export async function onRequestGet(context) {
    return new Response(JSON.stringify({ user: context.data.user }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
