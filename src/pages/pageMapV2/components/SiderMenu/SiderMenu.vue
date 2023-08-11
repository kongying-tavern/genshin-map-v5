<script lang="ts" setup>
import {
  Search,
  Sunny,
} from '@element-plus/icons-vue'
import { useCondition } from '../../hooks'
import { useAreaStore } from '@/stores'
import db from '@/database'

const props = defineProps<{
  collapse?: boolean
  modelValue?: string
}>()

// 排序
interface Sortable {
  sortIndex?: number
}
const sort = (a: Sortable, b: Sortable) => {
  const { sortIndex: ia = 0 } = a
  const { sortIndex: ib = 0 } = b
  return ib - ia
}

// 暗黑模式
const isDark = useDark()
const toggleDark = useToggle(isDark)

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

// 物品选择预设管理
const conditionManager = useCondition()

// 点位ID搜索
const markerSearch = ref('')

// 图标表
const icons = ref<Map<string, API.TagVo>>(new Map())
db.iconTag.each((res) => {
  icons.value.set(res.tag || '', res)
})

// 地区
const areaStore = useAreaStore()
const areas = computed(() => {
  return areaStore._areaList.filter((area) => {
    return area.isFinal
  })
})

// 物品
interface ItemVo extends API.ItemVo {
  child?: number[]
}

const items = asyncComputed<ItemVo[]>(async () => {
  if (conditionManager.area === undefined || conditionManager.itemType === undefined)
    return []
  const res = await db.item
    .where('areaId')
    .equals(conditionManager.area.id as number)
    .and(({ typeIdList = [] }) => typeIdList.includes(conditionManager.itemType?.id as number))
    .toArray()
  return res.sort(sort)
}, [])

const selectItem = (item: API.ItemVo) => {
  const shallowCopyValue = [...conditionManager.itemIds]
  const findIndex = shallowCopyValue.findIndex((value: number) => value === item.id)
  if (findIndex > -1)
    shallowCopyValue.splice(findIndex, 1)
  else
    shallowCopyValue.push(item.id!)
  conditionManager.itemIds = shallowCopyValue
}

const isInCondition = (item: API.ItemVo) => {
  return conditionManager.itemIds.includes(item.id!)
}

// 物品类型
const itemTypes = asyncComputed<API.ItemTypeVo[]>(async () => {
  const res = await db.itemType.filter(type => Boolean(type.isFinal)).toArray()
  conditionManager.itemTypeId = res.sort(sort)[0].id // 默认选择第一个
  return res.sort(sort)
}, [])
const selectItemType = (itemType: API.ItemTypeVo) => {
  conditionManager.itemTypeId = itemType.id
}
</script>

<template>
  <div class="sider-menu absolute top-0 left-0 bottom-0 flex" :class="{ 'is-collapse': collapse }">
    <div class="overflow-hidden h-full w-full rounded-2xl">
      <div class="sider-menu-extra-panel flex-1 flex flex-col p-4" :class="{ 'is-collapse': collapse }">
        <!-- 用户栏 -->
        <div class="bg-[--gs-fill-color] w-full rounded-md h-10 py-2 px-4 flex content-center">
          <img src="https://bbs-static.miyoushe.com/avatar/avatarDefaultPc.png" class="h-full">
          <div class="ml-2">
            地图用户
          </div>
          <el-button :icon="Sunny" circle @click="toggleDark()" />
        </div>

        <!-- 点位ID搜索栏 -->
        <el-input
          v-model="markerSearch" placeholder="点位ID跳转(ID: 114514)"
          class="mt-3" :prefix-icon="Search" size="large"
          style="--el-input-border-radius: 0.375rem;"
        />

        <!-- 地区 -->
        <div class="h-24 mt-3">
          <el-scrollbar height="96px">
            <div class="w-full grid grid-cols-2 gap-2">
              <div v-for="area in areas" :key="area.id" class="itemType" :class="{ 'is-select': conditionManager.areaCode === area.code }" @click="conditionManager.areaCode = area.code">
                <img :src="icons.get(area.iconTag || '')?.url" class="h-8 mr-2 inline">
                <p class="pt-1">
                  {{ area.name }}
                </p>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 物品类型 -->
        <div class="h-24 mt-3">
          <el-scrollbar height="96px">
            <div class="w-full grid grid-cols-2 gap-2">
              <div v-for="itemType in itemTypes" :key="itemType.id" class="itemType" :class="{ 'is-select': conditionManager.itemTypeId === itemType.id }" @click="selectItemType(itemType)">
                <img :src="icons.get(itemType.iconTag || '')?.url" class="h-8 mr-2 inline">
                <p class="pt-1">
                  {{ itemType.name }}
                </p>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 物品 -->
        <div class="flex-1 mt-3 overflow-y-auto scrollbar">
          <div class="w-full grid grid-cols-5 gap-2">
            <div v-for="item in items" :key="item.id" class="flex flex-col item group" :class="{ 'is-select': isInCondition(item) }" @click="selectItem(item)">
              <div class="item-image">
                <img :src="icons.get(item.iconTag || '')?.url" class="m-auto w-auto h-full">
              </div>
              <p class="pt-1 mx-auto text-center text-sm font-bold dark:font-normal dark:text-white text-gray-700">
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.el-popper.is-customized.sider-menu-tooltip {
  padding: 6px 12px;
  background: rgba(255, 249, 220, 0.8);
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
  background: var(--gs-bg-color1);
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

// 物品类型
.itemType {
  @apply rounded-md py-1 h-fit align-bottom flex justify-center hover:brightness-90 bg-[--gs-fill-color];
  &.is-select {
    @apply text-white bg-[--gs-primary-color];
  }
}

// 物品图片
.item-image {
  @apply h-16 w-16 mx-auto rounded-md p-2 bg-[--gs-fill-color] group-hover:brightness-90;
}
.item {
  @apply mb-2;
  &.is-select > .item-image {
    @apply bg-[--gs-bg-color1-notr] dark:backdrop-brightness-50;
  }
}

// 滚动条自定义
.scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: transparent; /* or add it to the track */
}

.scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-200 dark:bg-gray-600 rounded-md;
}
</style>
