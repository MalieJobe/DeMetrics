<script setup lang="ts">
import Mainform from './components/Form.vue';

const totalPercentage = ref(1);
provide('updateTotalPercentage', (value: number) => {
  totalPercentage.value = value;
});

</script>

<template>
  <div
    class="antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen place-content-center flex flex-col items-center justify-center text-sm sm:text-base md:px-0 px-2">
    <div class="flex-1 flex flex-col gap-y-16 py-14">
      <header>
        <h1
          class=" text-5xl font-bold text-center bg-gradient-to-br from-primary to-accent text-transparent bg-clip-text">
          DeMetrics
        </h1>
        <h2 class="text-2xl font-semibold text-center">What percentage of the population match your dating preferences?
        </h2>
      </header>
      <main>
        <Mainform />
      </main>
      <footer>Created with ❤️ by <a href="https://github.com/MalieJobe/">Malie</a></footer>
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