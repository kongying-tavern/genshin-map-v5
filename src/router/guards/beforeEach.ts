import type { NavigationGuardWithThis, Router } from 'vue-router'
import { isInPermissionList, isInWhiteList } from '../utils'
import { useUserStore } from '@/stores'
import { Logger } from '@/utils'

const logger = new Logger('[beforeEachGuard]')

/** 导航前置守卫，使用函数传递参数来生成一个回调，以便后期增加更多操作 */
export const beforeEachGuard = (
  router: Router,
): NavigationGuardWithThis<void> => {
  return async (to, from, next) => {
    Logger.group('[vue-router-process]')
    logger.info(`"${from.path}" => "${to.path}"`)

    const userStore = useUserStore()

    const go = () => {
      userStore.isRouteLoading = true
      next(true)
    }

    const isTokenValid = userStore.validateUserToken()
    console.log('isTokenValid', isTokenValid)

    const isRouteExist = router.getRoutes().find(route => route.path === to.path)
    if (!isRouteExist)
      return next(new Error('目标路由不存在'))

    if (!isTokenValid) {
      userStore.refreshAuth()
    }

    // 确保在进入路由时用户设置已更新
    !userStore.preference.filterStates && await userStore.updateUserPreference()
    go()

    userStore.createRefreshTimer()
    to.meta.preload && await userStore.preloadMission()
  }
}
