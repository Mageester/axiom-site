import { apiError, json } from '../_utils/http';

export async function onRequestGet(context: any) {
    if (!context.data || !context.data.user) {
        return apiError(401, 'Unauthorized');
    }

    const { username, role, must_change_password } = context.data.user;

    return json({
        user: { username, role, must_change_password: !!must_change_password }
    });
}
