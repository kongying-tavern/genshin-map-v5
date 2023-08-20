import type { ShallowRef } from 'vue'
import dayjs from 'dayjs'
import { useArchiveStore } from '@/stores'
import { useMap } from '@/pages/pageMapV2/hooks'

export const useMarkerFinished = (markerInfo: ShallowRef<API.MarkerVo | null>) => {
  const archiveStore = useArchiveStore()

  const { map } = useMap()

  const isFinished = computed({
    get: () => {
      if (markerInfo.value?.id === undefined)
        return false
      return archiveStore.currentArchive.value.Data_KYJG.has(markerInfo.value.id)
    },
    set: (v) => {
      if (markerInfo.value?.id === undefined)
        return
      if (v) {
        archiveStore.currentArchive.value.Data_KYJG.delete(markerInfo.value?.id)
        archiveStore.currentArchive.value.Time_KYJG[markerInfo.value?.id] = ''
      }
      else {
        archiveStore.currentArchive.value.Data_KYJG.add(markerInfo.value?.id)
        archiveStore.currentArchive.value.Time_KYJG[markerInfo.value?.id] = dayjs().format('YYYY/MM/DD HH:mm:ss')
      }
      archiveStore.currentArchive.value.updated_at = Date.now()
      map.value?.baseLayer?.forceUpdate()
    },
  })

  return { isFinished }
}
