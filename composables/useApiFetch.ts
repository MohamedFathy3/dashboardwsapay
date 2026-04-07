import type { UseFetchOptions } from "#app";
import { useNotify } from '~/composables/useNotify'
const notify = useNotify()

type ApiFetchOptions<T> = UseFetchOptions<T> & {
    skipUnauthorizedHandler?: boolean;
    authType?: 'admin' | 'member';
}

export function useApiFetch<T>(path: string, options: ApiFetchOptions<T> = {}) {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl; // Already includes `/backend`
    const { authType = 'admin', skipUnauthorizedHandler = false, onResponseError, ...fetchOptions } = options;

    if (!path.startsWith('/')) {
        path = '/' + path; // Ensure the path starts with a slash
    }

    let headers: Record<string, string> = {
        accept: 'application/json',
        referer: config.public.appUrl,
    };

    const token = useCookie('XSRF-TOKEN');
    if (token.value) {
        headers['X-XSRF-TOKEN'] = token.value as string;
    }

    const userStore = useUserStore();
    const memberStore = useMemberStore();
    const bearerToken = authType === 'member' ? memberStore.token : userStore.token;
    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    return $fetch<T>(`${apiUrl}${path}`, {
        ...fetchOptions,
        headers: {
            ...headers,
            ...(fetchOptions.headers || {}),
        },
        onResponseError({ response }) {
            if (onResponseError) {
                onResponseError({ response } as any);
            }

            if (skipUnauthorizedHandler) {
                return;
            }

            if (response.status === 401) {
                const message = response?._data.message || 'Login failed, please try again.';
           
                notify.error(message);

                if (authType === 'member') {
                    memberStore.token = '';
                    memberStore.profile = null;
                    memberStore.recipients = [];
                    navigateTo('/member/login');
                    return;
                }

                userStore.clearAuth();
                navigateTo('/login');
            }
        },
    });
}
