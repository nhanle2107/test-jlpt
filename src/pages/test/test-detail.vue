<script lang="ts" setup>
import TestServices from '@/services/tests/testService'

export interface Explain {
  vi: string,
  en: string,
  ko: string,
  'zh-CN': string,
  'zh-TW': string,
}

export interface TextRead {
  ja: string | null
}

export interface General {
  audio: string | null,
  image: string | null,
  txt_read: TextRead
}

export interface SubQuestion {
  question: string,
  answers: string[],
  correct_answer: number,
  image: string | null,
  explain: Explain,
  tag: string
}

export interface Question {
  title: string,
  general: General,
  count_question: number,
  sub_question: SubQuestion[],
  correct_answers: number[]
}

export interface Content {
  kind: string | null,
  questions: Question[]
}

export interface Part {
  time: number,
  min_score: number,
  max_score: number,
  name: string,
  audioUrl?: string,
  audioName?: string,
  content: Content[]
}

export interface TestDetail {
  _id: string,
  title: string,
  level: number,
  time: number,
  pass_score: number,
  score: number,
  parts: Part[],
  author: string,
  cerated_at: string,
  checked: boolean
}

export interface TabInfo {
  index: number,
  name: string
}

const testData = ref<TestDetail>()
const testPart = ref<Part[]>()
const navigationTab = ref<number>(0)
const tabItems = ref([])

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
          testPart.value = response.data[0]["parts"]
          tabItems.value = response.data[0]["parts"].map((p: Part, index: number) => ({ index: index, name: p.name }))
          navigationTab.value = 0
        }
      })
  }
}
</script>

<template>
  <VRow>
    <VCol
      md="10"
      cols="12"
    >
      <VCard>
        <VTabs
          v-model="navigationTab"
          align-tabs="center"
        >
          <VTab
            v-for="item in tabItems"
            :key='item["index"]'
            :value='item["index"]'
          >
            {{ item["name"] }}
          </VTab>
        </VTabs>

        <!-- tabs content -->
        <VWindow v-model="navigationTab">
          <VWindowItem
            v-for="part in testPart"
            :key="part"
            :value="part"
            class="text-left part"
          >
            <VCard
              v-for="(mondai, mIndex) in part.content"
              class="mondai"
            >
              <VCardItem>
                <div v-html="mondai.questions[0].title"></div>
              </VCardItem>
              <VCardItem>
                <div v-html="mondai.questions[0].general.txt_read.ja"></div>
              </VCardItem>

              <VCardItem
                v-for="(subQuestion, index) in mondai.questions[0].sub_question"
                class="sub-question"
              >
                <VCartText class="question">
                  <VChip
                    color="primary"
                    variant="tonal"
                    size="small"
                  >
                    {{ `${mIndex + 1}.${index + 1}` }}
                  </VChip>
                  <div 
                    class="question-text" 
                    v-html="`<p>${subQuestion.question
                      .replaceAll('{', '<strong>')
                      .replaceAll('}', '</strong>')}</p>`"
                  ></div>
                </VCartText>
                <VRadioGroup class="answers">
                  <VRadio
                    v-for="(answer, index) in subQuestion.answers"
                    :label="answer"
                    :value="index"
                  ></VRadio>
                </VRadioGroup>
                <VCartText class="explain">
                  <VChip
                    color="success"
                    variant="tonal"
                    size="small"
                  >
                    {{ `Explain:` }}
                  </VChip>
                  <div 
                    class="explain-text" 
                    v-html="`<p>${subQuestion.explain.vi
                      .replaceAll('{', '<strong>')
                      .replaceAll('}', '</strong>')}</p>`"
                  ></div>
                </VCartText>
              </VCardItem>
            </VCard>

            <VCardText>
              <VBtn>Submit</VBtn>
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCard>
    </VCol>
    <VCol>
      <VCard>
        <VCardTitle class="text-center review">Review</VCardTitle>
      </VCard>
    </VCol>
  </VRow>
</template>

<style>
.part {
  font-size: x-large;
}
.title {
  display: inline-block;
}
.mondai {
  margin: 1rem;
}
.sub-question {
  margin-left: 2rem;
}
.question * {
  display: inline;
}
.text-capitalize {
  width: 3rem;
  padding: auto;
}
.question-text {
  margin-left: 1rem;
}
.answers {
  margin-left: 4rem;
}
.review {
  display: fixed;
}
.explain-text {
  margin-left: 2rem;
  font-size: large;
  color: black;
}
</style>
