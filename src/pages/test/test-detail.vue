<script lang="ts" setup>
import TestServices from '@/services/tests/testService'

export interface TextRead {
  ja: string | null
}

export interface General {
  audio: string | null,
  image: string | null,
  txt_read: TextRead
}

export interface Explain {
  vi: string,
  en: string,
  ko: string,
  'zh-CN': string,
  'zh-TW': string,
}

export interface SubQuestion {
  question: string,
  answers: string[],
  correct_answer: number,
  image: string | null,
  explain: Explain,
  tag: string,
  showExplain: boolean,
  user_answer: number | null
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
const tabItems = ref()
const answerSheet = ref<any>()
const time = ref<number>(0)
const savedTime = ref<number>(0)
const renderTime = ref<string>('00:00')
const isSubmit = ref<boolean>(false)

const reviewBgColor = ['success', 'warning', 'primary']

onBeforeMount(() => {
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault()
    console.log("refresh")
    return ""
  })
})

onBeforeRouteLeave((_to, _from, next) => {
  const msg = 'Do you confirm to leave?'
  if (!window.confirm(msg)) {
    return
  }
  next()
})

onMounted(() => {
  getTestData()
})

const timer = setTimeout(() => {
  if (time.value == 0) {
    clearTimeout(timer)
  }
  time.value -= 1
}, 1000)

const customTime = () => {
  if (time.value > 0) {
    setTimeout(() => {
      time.value -= 1
      var m = `${Math.floor(time.value / 60)}`
      if (m.length == 1) {
        m = `0${m}`
      }
      var s = `${Math.floor(time.value % 60)}`
      if (s.length == 1) {
        s = `0${s}`
      }
      renderTime.value = `${m}:${s}`
      if (time.value == 1) {
        savedTime.value = 0
      }
      customTime()
    }, 1000)
  }
  else {
    handleSubmit()
  }
}

const handleSubmit = () => {
  isSubmit.value = true
  var countCorrect = 0
  var countTotal = 0
  for (var p = 0; p < answerSheet.value.length; p++) {
    for (var m = 0; m < answerSheet.value[p].length; m++) {
      for (var q = 0; q < answerSheet.value[p][m].length; q++) {
        if (answerSheet.value[p][m][q].is_correct) {
          countCorrect += 1
        }
        countTotal += 1
      }
    }
  }
  renderTime.value = `${countCorrect}/${countTotal}`
}

const onSubmit = () => {
  savedTime.value = time.value
  time.value = 0
}

const handleUnsubmit = () => {
  isSubmit.value = false
  time.value = savedTime.value
  customTime()
}

const getTestData = async () => {
  const currentURL = window.location.pathname
  const t = currentURL.split('/')
  const id = t[t.length - 1]
  if (id !== null) {
    await TestServices.getTestDetail(id)
      .then(response => {
        if (response.status === 200) {
          const data = handleFetchDate(response.data[0])
          testData.value = data
          testPart.value = data.parts
          tabItems.value = data.parts.map((p: Part, index: number) => ({ index: index, name: p.name }))
          navigationTab.value = 0
          setAnswerSheet(data.parts)
          time.value = data.time * 60
          savedTime.value = data.time * 60
          customTime()
        }
      })
  }
}

const handleFetchDate = (data: TestDetail) => {
  for (var p = 0; p < data.parts.length; p++) {
    for (var m = 0; m < data.parts[p].content.length; m++) {
      if (data.parts[p].content[m].questions[0].sub_question[0].question == "") {
        data.parts[p].content.splice(m, 1)
        m--
        continue
      }
      for (var q = 0; q < data.parts[p].content[m].questions.length; q++) {
        for (var sub = 0; sub < data.parts[p].content[m].questions[q].sub_question.length; sub++) {
          if (data.parts[p].content[m].questions[q].sub_question[sub].question == 'れい') {
            data.parts[p].content[m].questions[q].sub_question.splice(sub, 1)
            sub--
            continue
          }
          if (!data.parts[p].content[m].questions[q].sub_question[sub].answers) {
            data.parts[p].content[m].questions[q].sub_question[sub].answers = ['1', '2', '3', '4']
          }
          data.parts[p].content[m].questions[q].sub_question[sub] = {
            ...data.parts[p].content[m].questions[q].sub_question[sub],
            showExplain: false,
            user_answer: null
          }
        }
      }
    }
  }
  return data
}

const setAnswerSheet = (parts: Part[]) => {
  var ansPart = []
  for (var p = 0; p < parts.length; p++) {
    var ansMondai = []
    for (var m = 0; m < parts[p].content.length; m++) {
      var ans = []
      for (var q = 0; q < parts[p].content[m].questions[0].sub_question.length; q++) {
        ans.push({
          answer: null,
          correct_answer: parts[p].content[m].questions[0].sub_question[q].correct_answer,
          is_correct: false,
        })
      }
      ansMondai.push(ans)
    }
    ansPart.push(ansMondai)
  }

  answerSheet.value = ansPart
}

const checkAnswer = (part: number, mondai: number, question: number, answer: number) => {
  const correct = answerSheet.value[part][mondai][question].correct_answer == answer
  answerSheet.value[part][mondai][question] = {
    ...answerSheet.value[part][mondai][question],
    answer: answer,
    is_correct: correct
  }
}
</script>

<template>
  <VRow>
    <VCol
      md="10"
      cols="12"
      class="one"
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

        <VWindow v-model="navigationTab">
          <VWindowItem
            v-for="part in testPart"
            :key="part"
            :value="part"
            class="text-left part"
          >
            <audio controls v-if="part.audioUrl">
              <source :src="part.audioUrl" type="audio/mpeg">
            </audio>
            <div v-if="navigationTab < 3">
              <VCard
                v-for="(mondai, mIndex) in part.content"
                class="mondai"
              >
                <VCardItem>
                  <div v-html="mondai.questions[0].title"></div>
                </VCardItem>
                <VCardItem v-if="mondai.questions[0].general.txt_read.ja">
                  <div v-html="mondai.questions[0].general.txt_read.ja"></div>
                </VCardItem>

                <VCardItem
                  v-for="(subQuestion, subIndex) in mondai.questions[0].sub_question"
                  class="sub-question"
                >
                  <VCardText class="question">
                    <VChip
                      color="primary"
                      variant="tonal"
                      size="small"
                    >
                      {{ `${mIndex + 1}.${subIndex + 1}` }}
                    </VChip>
                    <div 
                      class="question-text" 
                      v-html="`<p>${subQuestion.question
                        .replaceAll('*', '★')
                        .replaceAll('＊', '★')
                        .replaceAll('{', '<strong>')
                        .replaceAll('}', '</strong>')}</p>`"
                    ></div>
                  </VCardText>
                  <VRadioGroup class="answers">
                    <VRadio
                      v-for="(answer, index) in subQuestion.answers"
                      :label="answer"
                      :value="index"
                      :color="isSubmit ? 
                        (subQuestion.correct_answer == subQuestion.user_answer ? 'success' : 'error') 
                        : 'primary'"
                      :onchange="() => {
                        checkAnswer(navigationTab, mIndex, subIndex, index)
                        subQuestion.user_answer = index
                      }"
                    >
                      <template v-slot:label>
                        <div v-if="isSubmit && index == subQuestion.user_answer">
                          <strong v-if="subQuestion.correct_answer == subQuestion.user_answer" class="text-success">
                            {{ answer }}
                          </strong>
                          <strong v-else class="text-error">
                            {{ answer }}
                          </strong>
                        </div>
                        <div v-else>{{ answer }}</div>
                      </template>
                    </VRadio>
                  </VRadioGroup>
                  <VBtn 
                    variant="outlined"
                    rounded
                    style="margin-block-start: 1rem; margin-inline-start: 3rem;"
                    :onclick="() => subQuestion.showExplain = !subQuestion.showExplain"
                  >
                    {{ subQuestion.showExplain ? 'Hide explaination' : 'Show explaination' }}
                  </VBtn>
                  <VCardText v-show="subQuestion.showExplain" class="explain">
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
                  </VCardText>
                </VCardItem>
              </VCard>
            </div>
            
            <VCardText>
              <VBtn 
                style="align-items: center;"
                :onclick="() => { isSubmit ? handleUnsubmit() : onSubmit() }"
              >
                {{  isSubmit ? 'Unsubmit' : 'Submit' }}
              </VBtn>
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCard>
    </VCol>

    <VCol class="two">
      <VCard class="review">
        <VCardTitle class="text-center">{{ renderTime }}</VCardTitle>
      </VCard>
      <VCard 
        v-for="(part, pIdx) in answerSheet"
        class="review"
        :color="reviewBgColor[pIdx]"
      >
        <VCard 
          v-for="(mondai, mIdx) in part"
          style=" padding: 0.5rem; margin: 1rem;"
        >
          <div
            v-for="(ans, index) in mondai"
            style="display: inline-flex; margin: 0.5rem;"  
          >
            <div>
              <span>{{ `${mIdx + 1}.${index + 1}` }}</span>
              <VChip
                :color="isSubmit ? ( ans.is_correct ? 'success' : 'error' ) : 'primary'"
                :variant="isSubmit ? ( ans.is_correct ? 'tonal' : 'elevated' ) : 'tonal'"
                size="small"
                style="margin-inline-start: 0.5rem;"
              >
                {{  ans.answer !== null ? `${ans.answer + 1}` : ` ` }}
              </VChip>
            </div>
          </div>
        </VCard>
      </VCard>
    </VCol>
  </VRow>
</template>

<style>
@media only screen and (max-width: 699px) {
  .mondai img {
    display: block;
    inline-size: 80%;
  }

  .sub-question {
    margin-inline-start: 0;
  }
}

@media only screen and (min-width: 600px) {
  .mondai img {
    display: block;
    inline-size: 50%;
  }

  .sub-question {
    margin-inline-start: 2rem;
  }
}

.part {
  font-size: x-large;
}

.title {
  display: inline-block;
}

.mondai {
  margin: 1rem;
  font-weight: bold;
}

.question * {
  display: inline;
}

.text-capitalize {
  padding: auto;
  inline-size: 3rem;
}

.question-text {
  margin-inline-start: 1rem;
}

.answers {
  margin-inline-start: 4rem;
}

.review {
  z-index: 10;
  display: contents;
  padding:40px;
  background: #eee;
  margin-block-end: 0.5rem;
  text-align: center;
}

.explain-text {
  color: black;
  font-size: large;
  margin-inline-start: 2rem;
}

audio {
  inline-size: calc(100% - 2rem);
  margin-block-start: 1rem;
  margin-inline: 1rem;
  margin-inline-end: 1rem;
}
</style>
