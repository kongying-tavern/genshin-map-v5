import { defineStore } from 'pinia'

export interface ArchiveBody {
  /** 点位存档 */
  Data_KYJG: Set<number>
  /**
   * 刷新时间存档
   * @format `YYYY/MM/DD HH:mm:ss`
   */
  Time_KYJG: Record<number, string>
  /** 最新修改时间 */
  updated_at: number
}

// gitee鉴权信息
export interface GiteeAuth {
  /** gitee 用户名 */
  username: string
  /** gitee token */
  token: string
  /** gitee refresh_token */
  refresh_token: string
}
const localUserAuth = useStorage<Partial<GiteeAuth>>('__ysmap_gitee_auth', {})

// gitee存档数据结构
interface GiteeArchive {
  files: Record<string, Record<string, string>>
  description: string
  updated_at: string
  created_at: string
}

// 本地存档数据
const localArchive = useStorage<ArchiveBody>('__ysmap_archive', {
  Data_KYJG: new Set(),
  Time_KYJG: {},
  updated_at: Date.now(),
})

/**
 * 存档管理
 */
export const useArchiveStore = defineStore('global-archive', {
  state: () => ({
    fetchLoading: false,
  }),

  getters: {
    /** 当前存档 */
    currentArchive: () => localArchive,
  },

  actions: {
    /** 请求gitee授权, 跳转到一个Url */
    giteeAuthorize() {
      location.href = 'https://gitee.com/oauth/authorize?client_id=844e73cca6596c68e2ebd0fc1b8950d7a463b031085e851a23315d44e405effb&redirect_uri=http://127.0.0.1:9001/&response_type=code'
    },
  },
})
