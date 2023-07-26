import { request } from '@/utils'

/** 登录 - 客户端授权码模式 */
export async function token(
  options?: { [key: string]: any },
) {
  const form = new FormData()
  const params = {
    grant_type: 'client_credentials',
    scope: 'all',
  }
  for (const key in params) {
    const value = params[key as keyof typeof params]
    form.append(key, value)
  }
  return request<API.SysToken>('/oauth/token', {
    method: 'POST',
    params: params,
    auth: {
      username: import.meta.env.VITE_API_AUTH_USERNAME,
      password: import.meta.env.VITE_API_AUTH_PASSWORD,
    },
    ...(options || {}),
  })
}

export async function refresh(header: API.SysRefreshVO) {
  const params = new URLSearchParams()
  for (const key in header)
    params.append(key, header[key as keyof API.SysRefreshVO])
  return request<API.SysToken>(`/oauth/token?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    auth: {
      username: import.meta.env.VITE_API_AUTH_USERNAME,
      password: import.meta.env.VITE_API_AUTH_PASSWORD,
    },
  })
}
