<script lang="ts" setup>
import TestServices from '@/services/tests/testService';

const testData = ref({})
const navigationTab = ref('')
const tabItems = ref([])
const tabContent = ' and remember that cards...'

onMounted(() => {
  getTestData()
})

const getTestData = async () => {
  const currentURL = window.location.pathname
  const t = currentURL.split('/')
  const id = t[t.length - 1]
  if (id !== null) {
    await TestServices.getTestDetail(id)
      .then(response => {
        if (response.status === 200) {
          testData.value = response.data[0]
          tabItems.value = response.data[0]["parts"].map(p => p["name"])
          navigationTab.value = response.data[0]["parts"][0]["name"]
        }
      })
  }
}
</script>

<template>
  <VRow>
    <VCol
      md="12"
      cols="12"
    >
      <VCard>
        <VTabs
          v-model="navigationTab"
          align-tabs="center"
        >
          <VTab
            v-for="item in tabItems"
            :key="item"
            :value="item"
          >
            {{ item }}
          </VTab>
        </VTabs>

        <!-- tabs content -->
        <VWindow v-model="navigationTab">
          <VWindowItem
            v-for="item in tabItems"
            :key="item"
            :value="item"
            class="text-center"
          >
            <VCardItem>
              <VCardTitle>Navigation Card</VCardTitle>
            </VCardItem>

            <VCardText>{{ tabContent }}</VCardText>

            <VCardText>
              <VBtn>Learn More</VBtn>
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCard>
    </VCol>
  </VRow>
</template>
