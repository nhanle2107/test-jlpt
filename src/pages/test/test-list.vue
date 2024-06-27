<script setup lang="ts">
import { VBtn } from 'vuetify/lib/components/VBtn/index.mjs';
import TestServices from '@/services/tests/testService';
import { router } from '@/plugins/router';

interface Data {
  id: string,
  title: string,
  level: number,
  time: number,
  score: number,
  pass_score: number
}

const route = useRoute()
const dataList = ref<Data[]>([])
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'TITLE', key: 'title' },
  { title: 'LEVEL', key: 'level' },
  { title: 'TIME', key: 'time' },
  { title: 'SCORE', key: 'score' },
  { title: 'PASSED SCORE', key: 'pass_score' },
  { title: 'ACTIONS', key: 'actions' },
]

onMounted(() => {
  getList(route.params.level)
})

onBeforeRouteUpdate((to, _) => {
  getList(to.params.level)
})

const getList = async (level: any) => {
  level = level.toString()
  if (/^[1-5]$/g.test(level)) {
    await TestServices.getAll(Number(level))
      .then(response => {
        dataList.value = response.data["data"]
          .sort((a: Data, b: Data) => {
            const titleA = Number(a.title.split(' ')[1])
            const titleB = Number(b.title.split(' ')[1])
            if (titleA < titleB) return -1
            if (titleA > titleB) return 1
            return 0
          })
      })
  }
}

const takeTest = (item: Data) => {
  router.push(`/test/${item.id}`)
}
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="dataList"
    :items-per-page="25"
    class="text-no-wrap"
  >
    <template #item.id="{ item }">
      <div class="d-flex align-center">
        <div class="d-flex flex-column ms-3">
          <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.id }}</span>
        </div>
      </div>
    </template>

    <!-- Actions -->
    <template #item.actions="{ item }">
      <div class="d-flex gap-1">
        <VBtn
          size="small"
          @click="takeTest(item)"
        >
          <VIcon icon="ri-arrow-right-double-line"/>
        </VBtn>
      </div>
    </template>
  </VDataTable>
</template>
