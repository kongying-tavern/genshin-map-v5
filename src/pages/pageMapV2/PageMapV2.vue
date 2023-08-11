<script lang="ts" setup>
import { useInteractionLayer, useMap, useMapState, useMarkerDrawer } from './hooks'
import { genshinMapCanvasKey, mapAffixLayerKey, mutuallyExclusiveLayerKey } from './shared'
import {
  CollapseButton,
  MapAffix,
  MapInventory,
  MapOverlay,
  MapSiderMenu,
  MarkerPopover,
} from './components'
import { GSSwitch } from '@/components'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const mutuallyExclusiveLayerRef = ref<HTMLElement | null>(null)
const mapAffixLayerRef = ref<HTMLElement | null>(null)

const { map } = useMap(canvasRef)
useMarkerDrawer(canvasRef)
const { visible: interactionLayerVisible } = useInteractionLayer()
const { showOverlay } = useMapState(true)

const collapse = ref(true)
useEventListener('keypress', (ev) => {
  if (ev.code === 'Backquote')
    collapse.value = !collapse.value
})

provide(genshinMapCanvasKey, canvasRef)
provide(mutuallyExclusiveLayerKey, mutuallyExclusiveLayerRef)
provide(mapAffixLayerKey, mapAffixLayerRef)
</script>

<template>
  <div class="w-full h-full relative">
    <div class="map-mask absolute left-0 top-0 w-full h-full pointer-events-none" />

    <canvas ref="canvasRef" class="map-renderer w-full h-full bg-black" />

    <div class="map-interaction-layer absolute left-0 top-0 w-full h-full pointer-events-none transition-all">
      <!-- 地图设置 -->
      <div
        class="map-tiny-settings absolute bottom-0 right-36 p-2 flex flex-col gap-2 invisible sm:visible z-10 transition-all"
        :class="[
          interactionLayerVisible ? 'pointer-events-auto' : '-translate-x-6',
        ]"
      >
        <GSSwitch v-model="showOverlay" label="显示地下图层" size="large" />
      </div>

      <!-- 地下图层 -->
      <div ref="mapAffixLayerRef" class="map-affix-provider">
        <MapAffix
          v-for="(group, key) in map?.baseLayer?.overlayManager?.overlayGroups"
          :key="key"
          :pos="[group.bounds[0], group.bounds[1]]"
          :visible="showOverlay"
          zoom-with-map
          pickable
        >
          <MapOverlay :option-group="group" />
        </MapAffix>

        <MarkerPopover />
      </div>

      <!-- 收起按钮 -->
      <CollapseButton
        v-model:collapse="collapse"
        class="absolute bottom-2 pointer-events-auto"
        :class="[
          !collapse ? 'collapsed' : 'left-0',
        ]"
        :style="{
          '--tw-translate-x': '-300%',
        }"
      />

      <!-- 选中物品栏 -->
      <MapInventory
        v-model:collapse="collapse"
        class="absolute top-2 pointer-events-auto"
        :class="[
          !collapse ? 'collapsed' : 'left-0',
        ]"
        :style="{
          '--tw-translate-x': '-300%',
        }"
      />

      <!-- 侧边栏 -->
      <MapSiderMenu
        v-model:collapse="collapse"
        class="z-10 transition-all"
        :class="[interactionLayerVisible ? 'pointer-events-auto' : '-translate-x-full']"
      />

      <div
        ref="mutuallyExclusiveLayerRef"
        class="mutually-exclusive-layer absolute left-0 top-0 w-full h-full"
        :class="{ 'pointer-events-none': interactionLayerVisible }"
      />
    </div>

    <div
      ref="mutuallyExclusiveLayerRef"
      class="mutually-exclusive-layer absolute left-0 top-0 w-full h-full pointer-events-none"
      :class="{
        inactive: interactionLayerVisible,
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.inactive {
  pointer-events: none;
}

.map-mask {
  background: radial-gradient(transparent 50%, #00000060);
  z-index: 1;
}

.collapsed{
  left: 30rem;
}
</style>
