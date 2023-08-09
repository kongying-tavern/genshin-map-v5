<script lang="ts" setup>
import { CoffeeCup, SetUp, Setting } from '@element-plus/icons-vue'
import type { FeatureOption } from '../FeatureGrid'
import { useCurrentLayerMarkers, useMapState } from '@/pages/pageMapV2/hooks'
import { SiderMenu } from '@/pages/pageMapV2/components'
import { AppSettings } from '@/components'
import { useGlobalDialog } from '@/hooks'
import { useUserStore } from '@/stores'
import { IconGithub } from '@/components/AppIcons'

defineProps<{
  collapse: boolean
}>()

defineEmits<{
  (e: 'update:collapse', v: boolean): void
}>()

const { DialogService } = useGlobalDialog()
const userStore = useUserStore()
const router = useRouter()

const tabName = ref('filter')

const openUserInfoDialog = () => {
  userStore.showUserInfo = true
}

const openSettingDialog = () => DialogService
  .config({
    title: '系统设置',
    alignCenter: true,
    width: 'fit-content',
  })
  .open(AppSettings)

const features: FeatureOption[] = [
  { label: '管理页', value: 'manager', icon: SetUp },
  { label: '系统设置', value: 'setting', icon: Setting },
  { label: '赞助我们', value: 'sponsor', icon: CoffeeCup },
  { label: 'GitHub', value: 'GitHub', icon: IconGithub },
]

const onFeatureCommand = (command: string) => ({
  manager: () => router.push('/items'),
  setting: openSettingDialog,
  sponsor: () => window.open('https://opencollective.com/genshinmap'),
  GitHub: () => window.open('https://github.com/kongying-tavern/map_register_v3'),
} as Record<string, () => void>)[command]?.()

const { markers } = useCurrentLayerMarkers()

const { maxCacheTileSize, showBorder, showTag, showTooltip, showOverlay } = useMapState()
const cacheTiles = computed({
  get: () => maxCacheTileSize.value !== undefined,
  set: (v) => {
    maxCacheTileSize.value = v ? Number.MAX_SAFE_INTEGER : undefined
  },
})
</script>

<template>
  <SiderMenu v-model="tabName" :collapse="collapse" class="rounded-2xl" @update:collapse="v => $emit('update:collapse', v)" />
</template>
