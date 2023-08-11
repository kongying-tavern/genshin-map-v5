<script lang="ts" setup>
import { useCondition } from '../../hooks'
import db from '@/database'
import { useAreaStore } from '@/stores'

defineProps<{
  collapse?: boolean
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

// 图标表
const icons = ref<Map<string, API.TagVo>>(new Map())
db.iconTag.each((res) => {
  icons.value.set(res.tag || '', res)
})

// 物品选择预设管理
const conditionManager = useCondition()

// 地区
const areaStore = useAreaStore()
const areas = computed(() => {
  return areaStore._areaList
})

// 物品
interface ItemVo extends API.ItemVo {
  child?: number[]
}
const selectedItems = ref<ItemVo[]>([])
watch(() => conditionManager.conditionStateId, () => {
  db.item
    .filter(({ id = 0 }) => conditionManager.existItemIds.includes(id))
    .toArray()
    .then((res) => {
      selectedItems.value = res
    })
}, { immediate: true, deep: true })

// 物品类型
const itemTypes = asyncComputed<API.ItemTypeVo[]>(async () => {
  const res = await db.itemType.filter(type => Boolean(type.isFinal)).toArray()
  conditionManager.itemTypeId = res.sort(sort)[0].id // 默认选择第一个
  return res.sort(sort)
}, [])

// 获取物品所在地区，并推算出所在地区字符串
const getArea = (areaId: number) => {
  const area = areas.value.find(area => area.id === areaId)
  if (!area)
    return ''
  return area.name
}

// 删除物品
const removeItem = (item: API.ItemVo) => {
  const itemIdsMap = conditionManager.itemIdsMap
  for (const i in itemIdsMap) {
    const index = itemIdsMap[i].indexOf(item.id!)
    if (index !== -1) {
      const [areaCode, typeId] = i.split('-')
      const area = areas.value.find(area => area.code === areaCode)
      const type = itemTypes.value.find(type => type.id === Number(typeId))
      itemIdsMap[i].splice(index, 1)
      console.log('remove', item.id!, i, area, type, itemIdsMap[i])
      // this.#putCondition(area, type, itemIdsMap[i])
      conditionManager.deleteItem(area!, type!, itemIdsMap[i])
      break
    }
  }
  // conditionManager.deleteItem(
  //   item.id || 0,
  //   areas.value.find(area => area.id === item.areaId) || {},
  //   itemTypes.value.find(type => item.typeIdList?.includes(type.id || 0)) || {},
  // )
}
</script>

<template>
  <div v-if="selectedItems.length !== 0" v-bind="$attrs" class="sidebar-control-layer absolute p-2 z-10 transition-all">
    <div class="bg-[--gs-bg-color1] px-auto py-2 rounded-lg w-[58px] max-h-1/2 overflow-y-auto">
      <div class="flex-1 overflow-y-auto scrollbar">
        <div class="w-full grid gap-2">
          <div class="flex flex-col item">
            <el-tooltip effect="dark" content="清除物品" placement="right">
              <div class="item-image" @click="conditionManager.clearCondition()">
                <!-- <img :src="icons.get(item.iconTag || '')?.url" class="m-auto w-auto h-full"> -->
                <svg
                  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none"
                  version="1.1" width="50" height="50" viewBox="0 0 50 50"
                  class="m-auto w-auto h-full"
                >
                  <defs>
                    <clipPath id="master_svg0_59_8106/59_8093">
                      <rect x="0" y="0" width="50" height="50" rx="0" />
                    </clipPath>
                  </defs>
                  <g clip-path="url(#master_svg0_59_8106/59_8093)">
                    <g>
                      <path
                        d="M11.0268179765625,36.02688701171875C10.2132289765625,36.84038701171875,10.2132289765625,38.15958701171875,11.0268179765625,38.97318701171875C11.8404159765625,39.786687011718755,13.1595059765625,39.786687011718755,13.973095976562501,38.97318701171875C13.973095976562501,38.97318701171875,11.0268179765625,36.02688701171875,11.0268179765625,36.02688701171875C11.0268179765625,36.02688701171875,11.0268179765625,36.02688701171875,11.0268179765625,36.02688701171875ZM38.9731259765625,13.973157011718751C39.786625976562505,13.15956701171875,39.786625976562505,11.84047701171875,38.9731259765625,11.02688101171875C38.1595259765625,10.21329001171875,36.8403259765625,10.21329001171875,36.0268259765625,11.02688101171875C36.0268259765625,11.02688101171875,38.9731259765625,13.973157011718751,38.9731259765625,13.973157011718751C38.9731259765625,13.973157011718751,38.9731259765625,13.973157011718751,38.9731259765625,13.973157011718751ZM13.973095976562501,11.02687901171875C13.1595059765625,10.21329001171875,11.8404159765625,10.21329001171875,11.0268179765625,11.02687901171875C10.2132289765625,11.84046701171875,10.2132289765625,13.15956701171875,11.0268179765625,13.973157011718751C11.0268179765625,13.973157011718751,13.973095976562501,11.02687901171875,13.973095976562501,11.02687901171875C13.973095976562501,11.02687901171875,13.973095976562501,11.02687901171875,13.973095976562501,11.02687901171875ZM36.0268259765625,38.97318701171875C36.8403259765625,39.786687011718755,38.1595259765625,39.786687011718755,38.9731259765625,38.97318701171875C39.786625976562505,38.15958701171875,39.786625976562505,36.84038701171875,38.9731259765625,36.02688701171875C38.9731259765625,36.02688701171875,36.0268259765625,38.97318701171875,36.0268259765625,38.97318701171875C36.0268259765625,38.97318701171875,36.0268259765625,38.97318701171875,36.0268259765625,38.97318701171875ZM13.973095976562501,38.97318701171875C13.973095976562501,38.97318701171875,38.9731259765625,13.973157011718751,38.9731259765625,13.973157011718751C38.9731259765625,13.973157011718751,36.0268259765625,11.02688101171875,36.0268259765625,11.02688101171875C36.0268259765625,11.02688101171875,11.0268179765625,36.02688701171875,11.0268179765625,36.02688701171875C11.0268179765625,36.02688701171875,13.973095976562501,38.97318701171875,13.973095976562501,38.97318701171875C13.973095976562501,38.97318701171875,13.973095976562501,38.97318701171875,13.973095976562501,38.97318701171875ZM11.0268179765625,13.973157011718751C11.0268179765625,13.973157011718751,36.0268259765625,38.97318701171875,36.0268259765625,38.97318701171875C36.0268259765625,38.97318701171875,38.9731259765625,36.02688701171875,38.9731259765625,36.02688701171875C38.9731259765625,36.02688701171875,13.973095976562501,11.02687901171875,13.973095976562501,11.02687901171875C13.973095976562501,11.02687901171875,11.0268179765625,13.973157011718751,11.0268179765625,13.973157011718751C11.0268179765625,13.973157011718751,11.0268179765625,13.973157011718751,11.0268179765625,13.973157011718751Z"
                        class="fill-gray-600 dark:fill-gray-300" fill-opacity="1"
                      />
                    </g>
                  </g>
                </svg>
              </div>
            </el-tooltip>
          </div>
          <div v-for="item in selectedItems" :key="item.id" class="flex flex-col item">
            <el-tooltip effect="dark" :content="`${item.name} ${getArea(item.areaId || -1)}`" placement="right">
              <div class="item-image" @click="removeItem(item)">
                <img :src="icons.get(item.iconTag || '')?.url" class="m-auto w-auto h-full">
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 物品图像
.item-image {
  @apply h-10 w-10 mx-auto rounded-md p-[2px] bg-[--gs-fill-color] hover:brightness-90;
}
</style>
