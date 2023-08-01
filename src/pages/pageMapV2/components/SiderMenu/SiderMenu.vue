<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { contentRefKey, tabNameRefKey } from '.'

const props = defineProps<{
  collapse?: boolean
  modelValue?: string
}>()
const emits = defineEmits<{
  (e: 'update:collapse', v?: boolean): void
  (e: 'update:modelValue', v?: string): void
}>()

const contentRef = ref<HTMLElement | null>(null)
provide(contentRefKey, contentRef)

const bindTabName = computed({
  get: () => props.modelValue,
  set: v => emits('update:modelValue', v),
})
provide(tabNameRefKey, bindTabName)

const virtualRef = ref<HTMLElement>()
const tooltipContent = ref<string>()
const checkTooltip = (ev: Event) => {
  if (props.collapse) {
    virtualRef.value = undefined
    return
  }
  const findRes = ev.composedPath().find((target) => {
    return target instanceof HTMLElement && target.dataset.tabLabel
  })
  if (!findRes) {
    virtualRef.value = undefined
    return
  }
  virtualRef.value = findRes as HTMLElement
  tooltipContent.value = (findRes as HTMLElement).dataset.tabLabel
}
useEventListener('pointermove', checkTooltip)
useEventListener('pointerdown', checkTooltip)

const markerSearch = ref('')
</script>

<template>
  <div class="sider-menu absolute top-0 left-0 bottom-0 flex" :class="{ 'is-collapse': collapse }">
    <div class="overflow-hidden h-full w-full rounded-2xl">
      <div class="sider-menu-extra-panel flex-1 p-4" :class="{ 'is-collapse': collapse }">
        <div class="bg-amber-100 w-full rounded-md h-10 py-2 px-4 flex content-center">
          <img src="https://bbs-static.miyoushe.com/avatar/avatarDefaultPc.png" class="h-full">
          <div class="ml-2">地图用户</div>
        </div>
        <el-input v-model="markerSearch" placeholder="点位ID跳转(ID: 114514)"
          class="mt-3" :prefix-icon="Search" size="large"
          style="--el-input-border-radius: 0.375rem;"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.el-popper.is-customized.sider-menu-tooltip {
  padding: 6px 12px;
  background: rgba(255, 249, 220, 0.8);;
  color: #ECE5D8;
  font-size: 16px;

  .el-popper__arrow {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.sider-menu {
  margin: 20px;
  border-radius: 16px;
  width: 450px;
  max-width: 100%;
  @media screen and (width < 500px) {
    width: 100%;
  }
  &.is-collapse {
    pointer-events: none;
  }
}

.sider-menu-extra-panel {
  background: rgba(255, 249, 220, 0.8);;
  width: 100%;
  height: 100%;
  transition: all ease 150ms;
  opacity: 1;
  translate: 0 0;

  &.is-collapse {
    opacity: 0;
    translate: -50% 0;
  }
}
</style>
