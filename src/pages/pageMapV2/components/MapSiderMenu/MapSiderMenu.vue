<script lang="ts" setup>
import { SiderMenu } from '@/pages/pageMapV2/components'

defineProps<{
  collapse: boolean
}>()

defineEmits<{
  (e: 'update:collapse', v: boolean): void
}>()

const tabName = ref('filter')
</script>

<template>
  <SiderMenu v-model="tabName" :collapse="collapse" class="rounded-2xl" @update:collapse="v => $emit('update:collapse', v)" />
</template>
