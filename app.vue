<script setup lang="ts">
import FAQs from './components/FAQs.vue';
import Mainform from './components/Form.vue';

const percentages = reactive({
  totalPercentage: 1,
  totalSinglePercentage: 1,
  totalOfSelectedGender: 1,
})

provide('updateTotalPercentage', (p: {
  totalPercentage: number, totalSinglePercentage: number, totalOfSelectedGender: number
}) => {
  console.log(p)
  percentages.totalPercentage = p.totalPercentage;
  percentages.totalSinglePercentage = p.totalSinglePercentage;
  percentages.totalOfSelectedGender = p.totalOfSelectedGender;
});


const {data: faqsData} = await useAsyncData('faqs', () => queryContent('faqs').findOne())
const faqs = faqsData.value?.faqs;
</script>

<template>
  <div
    class="antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen place-content-center flex flex-col items-center justify-center text-sm sm:text-base md:px-0 px-2">
    <div class="flex-1 flex flex-col gap-y-16 py-8 w-full md:w-[800px] max-w-2xl">

      <header>
        <h1
          class=" text-5xl font-bold text-center bg-gradient-to-br from-primary to-accent text-transparent bg-clip-text">
          DateMe<span class=" opacity-30 text-black">trik</span>
        </h1>
        <h2 class="text-2xl font-semibold text-center mt-4">Finde heraus, wie viele Menschen deinen Dating-Kriterien
          entsprechen! 
        </h2>
      </header>
      <main>
        <Mainform />
      </main>

      <div class="result mt-8 text-center">
        <h2 class=" text-3xl font-bold mb-12 underline">Match Wahrscheinlichkeit</h2>
        <p class="text-7xl font-bold break-all text-balance max-w-3xl">
          {{
            (percentages.totalSinglePercentage * 100)
          }} %</p>
        <p class="mt-4 text-xl">der erwachsenen, deutschen Singles</p>


        <footer>
          <FAQs :faqs />
        </footer>
      </div>
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