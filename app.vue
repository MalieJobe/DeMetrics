<script setup lang="ts">
import FAQs from './components/FAQs.vue';
import Mainform from './components/Form.vue';

const status = ref('new'); // new, loading, loaded, error

const percentageOfSelectedGender = ref(1);
const selectedGender = ref('total'); // total, male, female

provide('updateTotalPercentage', (p:any) => {
  percentageOfSelectedGender.value = p.totalOfSelectedGender;
  status.value = 'loaded';
});


const {data: faqsData} = await useAsyncData('faqs', () => queryContent('faqs').findOne())
const faqs = faqsData.value?.faqs;
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
      </main>

      <div class="result mt-4 text-center">
        <p class="text-5xl font-bold break-all text-balance max-w-3xl">
          <span v-if="status === 'new'">XX,XXX %</span>
          <span v-else-if="status === 'loading'">rechnet...</span>
          <span v-else-if="status === 'error'">Fehler :/</span>
          <span v-else>{{ (percentageOfSelectedGender * 100) }} %</span>
        </p>
        <p class="mt-2 text-lg max-w-96 mx-auto leading-6">
          der erwachsenen, deutschen{{ selectedGender === 'male' ? ', männlichen' : selectedGender === 'female' ? ', weiblichen' : '' }} Singles entsprechen deinen Kriterien.
        </p>
        <p class="text-lg max-w-96 mx-auto leading-6">
          Das sind ungefähr <span class="font-bold">{{ Math.floor(69763000 * (selectedGender === 'male' || selectedGender === 'female' ? 0.5 : 1) * percentageOfSelectedGender).toLocaleString('de-DE') }} Menschen</span> in Deutschland.
        </p>


        <footer>
          <FAQs :faqs />
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th class="px-6 py-3">Kategorie</th>
                <th class="px-6 py-3">Quellen</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">Geschlecht</td>
                <td class="px-6 py-4">
                  <ul class="list-disc">
                    <li>
                  <a href="https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Bevoelkerungsstand/Tabellen/deutsche-nichtdeutsche-bevoelkerung-nach-geschlecht-deutschland.html" target="_blank">
                    Bevölkerung nach Nationalität und Geschlecht - Statistisches Bundesamt (destatis.de)
                  </a></li>
                  <li>
                  <a href="https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Bevoelkerungsstand/Methoden/Erlauterungen/geschlechtsauspraegungen.html" target="_blank">
                    Wie wird mit den Daten von Personen mit den Geschlechtsausprägungen 'unbekannt' oder 'divers' verfahren? - Statistisches Bundesamt (destatis.de)
                  </a>
                  </li>
                  </ul>
                </td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">Alter</td>
                <td class="px-6 py-4">
                  <a href="https://service.destatis.de/bevoelkerungspyramide/index.html#!y=2023" target="_blank">
                    Bevölkerungspyramide: Altersstruktur Deutschlands von 1950 - 2070 (destatis.de)
                  </a>
                </td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">Größe</td>
                <td class="px-6 py-4">
                  <a href="https://de.statista.com/statistik/daten/studie/1825/umfrage/koerpergroesse-nach-geschlecht/">
                    Körpergröße nach Geschlecht 2006 | Statista
                  </a>
                </td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">Köperbau</td>
                <td class="px-6 py-4">
                  <ul class="list-disc">
                    <li>
                  <a href="https://www.bpb.de/kurz-knapp/zahlen-und-fakten/soziale-situation-in-deutschland/516115/uebergewicht/" target="_blank" rel="noopener noreferrer">
                    Übergewicht | Die soziale Situation in Deutschland | bpb.de
                  </a></li>
                  <li>
                    <a href="https://www.rki.de/DE/Content/Kommissionen/Bundesgesundheitsblatt/Downloads/2019_10_Schienkiewitz_BMI.pdf?__blob=publicationFile" target="_blank" rel="noopener noreferrer">
                      Tabelle 1: Body-Mass-Index von Kindern und Jugendlichen: Prävalenzen und Verteilung unter Berücksichtigung von Untergewicht und extremer Adipositas
                    </a>
                  </li>
                </ul>
                </td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">Einkommen</td>
                <td class="px-6 py-4">
                  <a href="https://www.einkommensverteilung.eu/deutschland/" target="_blank">
                    Einkommensverteilung Deutschland | einkommensverteilung.eu
                  </a>
                </td>
              </tr>
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-6 py-4">Beziehungsstatus</td>
                <td class="px-6 py-4">
                  <a href="https://de.statista.com/statistik/daten/studie/286794/umfrage/umfrage-in-deutschland-zur-anzahl-der-singles-nach-alter/" target="_blank">
                    Singles in Deutschland nach Alter 2021 | Statista
                  </a>
                </td>
              </tr>
              
            </tbody>
          </table>
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