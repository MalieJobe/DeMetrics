<script setup lang="ts">
useHead({
  title: 'DateMetrik - Dating Rechner',
  meta: [
    { name: 'description', content: 'Finde heraus, wie viele Menschen deinen Dating-Kriterien entsprechen!' }
  ],
  htmlAttrs: {
    lang: 'de',
  },
})

import FAQs from './components/FAQs.vue';
import Mainform from './components/Form.vue';

const status = ref('new'); // new, loading, loaded, error

const percentageOfSelectedGender = ref(1);
const selectedGender = ref('total'); // total, male, female

provide('updateTotalPercentage', (p:any) => {
  percentageOfSelectedGender.value = p.totalOfSelectedGender;
  status.value = 'loaded';
});


const genderText = computed(() => {
  if (selectedGender.value === 'male') return ', männlichen';
  if (selectedGender.value === 'female') return ', weiblichen';
  return '';
});

const formattedPeopleCount = computed(() => {
  const baseCount = 69763000;
  const genderMultiplier = selectedGender.value === 'male' || selectedGender.value === 'female' ? 0.5 : 1;
  const count = Math.floor(baseCount * genderMultiplier * percentageOfSelectedGender.value);
  return count.toLocaleString('de-DE');
})


const {data: faqsData} = await useAsyncData('faqs', () => queryContent('faqs').findOne())
const faqs = faqsData.value?.faqs;

const {data: sourcesData} = await useAsyncData('sources', () => queryContent('sources').findOne())
const sources = sourcesData.value?.sources;
</script>

<template>
  <div
    class="antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen place-content-center flex flex-col items-center justify-center text-sm sm:text-base md:px-0 px-2">
    <div class="flex-1 py-8 w-full md:w-[800px] max-w-2xl">

      <header>
        <h1
          class=" text-5xl font-bold text-center bg-gradient-to-br from-primary to-accent text-transparent bg-clip-text">
          DateMe<span class=" opacity-30 text-black">trik</span>
        </h1>
        <h2 class="text-2xl font-semibold text-center mt-4">Finde heraus, wie viele Menschen deinen Dating-Kriterien
          entsprechen! 
        </h2>
      </header>
      <main class="mt-8">
        <Mainform
          @status-update="(newStatus)=>status = newStatus"
          @gender-select="(newGender)=>selectedGender = newGender" />

        <div class="result mt-4 text-center">
          <p class="text-5xl font-bold break-all text-balance max-w-3xl">
            <span v-if="status === 'new'">XX,XXX %</span>
            <span v-else-if="status === 'loading'">rechnet...</span>
            <span v-else-if="status === 'error'">Fehler :/</span>
            <span v-else>{{ (percentageOfSelectedGender * 100) }} %</span>
          </p>
          <p class="mt-2 text-lg max-w-96 mx-auto leading-6">
            der erwachsenen, deutschen{{ genderText }} Singles entsprechen deinen Kriterien.
          </p>
          <p class="text-lg max-w-96 mx-auto leading-6" v-if="status === 'loaded'">
            Das sind ungefähr <span class="font-bold">{{ formattedPeopleCount }} Menschen</span> in Deutschland.
          </p> 
        </div>
      </main>

      <footer class="">
        <FAQs :faqs />
        <table aria-label="Quellenangaben"
          class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th class="px-6 py-3">Kategorie</th>
              <th class="px-6 py-3">Quellen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in sources" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4">{{ category.name }}</td>
              <td class="px-6 py-4">
                <ul v-if="category.links.length > 1" class="list-disc">
                  <li v-for="(link, linkIndex) in category.links" :key="linkIndex">
                    <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.text }}</a>
                  </li>
                </ul>
                <a v-else :href="category.links[0].url" target="_blank" rel="noopener noreferrer">{{ category.links[0].text }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  </div>
</template>

<style>
*,
:before,
:after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: var(--un-default-border-color, #e5e7eb)
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
  font-feature-settings: normal;
  font-variation-settings: normal;
  -webkit-tap-highlight-color: transparent
}

body {
  margin: 0;
  line-height: inherit
}

h1,
h2,
h3 {
  font-size: inherit;
  font-weight: inherit
}

a {
  color: inherit;
  text-decoration: underline;
}

h1,
h2,
h3,
p {
  margin: 0
}

ul {
  list-style: none;
  margin: 0;
  padding: 0
}

img,
svg {
  display: block;
}

img {
  max-width: 100%;
  height: auto
}
</style>