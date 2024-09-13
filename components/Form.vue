<template>

    <!-- the first item in the options will be the default. dangerous as it can get out of sync with the ref thats set here up top -->
    <Radio title="Interessiert an" :options="[['total', 'Allen'], ['female', 'Frauen'], ['male', 'Männern']]"
        @change="onGenderChange" />

    <RangeSlider title="Altersspanne (Jahre)" :fullRange="ageRange" :minStart="20" :maxStart="35" unit="year"
        @change="onAgeChange" />
    <RangeSlider title="Größe (cm)" :fullRange="heightRange" unit="length" @change="onHeightChange" />
    <RangeSlider title="Körperbau (BMI)" :fullRange="weightRange" @change="onWeightChange" />
    <RangeSlider title="Einkommen (€/Jahr)" :fullRange="incomeRange" unit="currency" @change="onIncomeChange" />

    <!-- calculate percentage button -->
    <button @click="callPercentageApi"
        class="block mx-auto w-full sm:w-1/2 font-bold text-2xl break-word 
            py-2 px-4 rounded bg-gradient-to-br from-primary to-accent mt-12
            shadow-md text-transparent bg-clip-text border-primary border-opacity-30 border
            uppercase hover:shadow-xl transition-shadow">
        Berechnen
    </button>

</template>

<script setup>
import RangeSlider from './RangeSlider.vue';
const updateTotalPercentage = inject('updateTotalPercentage');

const ageRange = ref([]);
const heightRange = ref([]);
const weightRange = ref([]);
const incomeRange = ref([]);

const minAge = ref(undefined);
const maxAge = ref(undefined);
const maxHeight = ref(undefined);
const minHeight = ref(undefined);
const minWeight = ref(undefined);
const maxWeight = ref(undefined);
const minIncome = ref(undefined);
const maxIncome = ref(undefined);

const gender = ref('total');

// todo: switch to using BMI instead of categories, then label along the slider

const { data } = await useAsyncData('ranges', () => queryContent('ranges').only(['age', 'height', 'weight', 'income']).findOne())

let processedData = {};
for (const key in data.value) {
    processedData[key] = data.value[key].map(item =>
        item === 'Infinity' ? Infinity : item === '-Infinity' ? -Infinity : item
    );
}

ageRange.value = processedData.age;
heightRange.value = processedData.height;
weightRange.value = processedData.weight;
incomeRange.value = processedData.income;

const emit = defineEmits(['statusUpdate', 'genderSelect']);

async function callPercentageApi() {
    emit('statusUpdate', 'loading');

    const { data, status, error } = await $fetch("/api/percentage", {
        params: {
            minAge: minAge.value,
            maxAge: maxAge.value,
            minHeight: minHeight.value,
            maxHeight: maxHeight.value,
            minWeight: minWeight.value,
            maxWeight: maxWeight.value,
            minIncome: minIncome.value,
            maxIncome: maxIncome.value,
            gender: gender.value,
        },
    });

    if (error) {
        console.error(error);
        emit('statusUpdate', 'error');
        return;
    }
    if (data) {
        updateTotalPercentage(data);
    }
}


async function onAgeChange(range) {
    minAge.value = range.min;
    maxAge.value = range.max;
}

async function onHeightChange(range) {
    minHeight.value = range.min;
    maxHeight.value = range.max;
}

async function onWeightChange(range) {
    minWeight.value = range.min;
    maxWeight.value = range.max;
}

async function onIncomeChange(range) {
    minIncome.value = range.min;
    maxIncome.value = range.max;
}

async function onGenderChange(value) {
    gender.value = value;
    emit('genderSelect', value);
}
</script>