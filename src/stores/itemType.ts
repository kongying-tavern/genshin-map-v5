import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'
import { liveQuery } from 'dexie'
import { messageFrom } from '@/utils'
import Api from '@/api/api'
import db, { AppDatabaseApi } from '@/database'
import { localSettings } from '@/stores'
import { secondClock } from '@/shared'

const loading = ref(false)
const updateTimer = ref<number>()
const updateEnd = ref<number>()
const total = ref(0)

/** 本地物品类型数据 */
export const useItemTypeStore = defineStore('global-item-type', {
  state: () => ({
    _itemTypeList: [] as API.ItemTypeVo[],
  }),

  getters: {
    total: () => total.value,
    itemTypeMap: state => (Object.fromEntries(state._itemTypeList.map(itemType => [
      itemType.id as number,
      itemType,
    ])) as Record<string, API.ItemTypeVo>),
    /** 全量更新处理状态 */
    updateAllLoading: () => loading.value,
    /** 全量更新剩余时间 */
    updateAllRestTime: () => updateEnd.value === undefined ? 0 : updateEnd.value - secondClock.value,
  },

  actions: {
    /** 更新物品类型数据 */
    async updateItemTypeInfo() {
      const { data = [] } = await Api.itemType.listItemType({})
      await AppDatabaseApi.itemType.bulkPut(data)
      return data.length
    },

    /** 全量更新 */
    async updateAll() {
      try {
        loading.value = true
        const startTime = dayjs()
        const total = await this.updateItemTypeInfo()
        const spentTime = (dayjs().diff(startTime) / 1000).toFixed(0)
        localSettings.value.noticeDataUpdated && ElNotification.success({
          title: !total ? '物品类型已经是最新' : '物品类型更新成功',
          message: !total ? undefined : `本次共更新物品类型 ${total} 个，耗时 ${spentTime} 秒`,
          position: 'bottom-right',
        })
      }
      catch (err) {
        ElNotification.error({
          title: '物品类型更新失败',
          message: messageFrom(err),
          position: 'bottom-right',
        })
      }
      finally {
        loading.value = false
      }
    },

    /** 清除全部物品类型 */
    async clearAll() {
      try {
        loading.value = true
        await db.itemType.clear()
      }
      catch {
        // no action
      }
      finally {
        loading.value = false
      }
    },

    /** 清除后台定时任务 */
    clearBackgroundUpdate() {
      window.clearTimeout(updateTimer.value)
      updateTimer.value = undefined
    },

    /** 后台定时自动更新 */
    async backgroundUpdate() {
      if (updateTimer.value !== undefined)
        this.clearBackgroundUpdate()
      await this.updateAll()
      const interval = (localSettings.value.autoUpdateInterval ?? 20) * 60000
      updateEnd.value = new Date().getTime() + interval
      updateTimer.value = window.setTimeout(() => {
        updateTimer.value = undefined
        this.backgroundUpdate()
      }, interval)
    },
  },
})

liveQuery(() => db.itemType.toArray()).subscribe((itemTypeList) => {
  total.value = itemTypeList.length
  useItemTypeStore()._itemTypeList = itemTypeList
})
