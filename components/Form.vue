<template>
    <div class="flex flex-row gap-x-10">

        <!-- the first item in the options will be the default. dangerous as it can get out of sync with the ref thats set here up top -->
        <Dropdown title="Preferred Gender" :options="[['total', 'All Genders'], ['female', 'Woman'], ['male', 'Men']]"
            @change="onGenderChange" />
        <Dropdown title="Only Singles?" :options="[[true, 'Yes'], [false, 'No, include Singles']]"
            @change="onSingleChange" />
    </div>

    <RangeSlider title="Age" :fullRange="ageRange" :minStart="20" :maxStart="35" unit="year" @change="onAgeChange" />
    <RangeSlider title="Height" :fullRange="heightRange" unit="length" @change="onHeightChange" />
    <RangeSlider title="Weight" :fullRange="weightRange" @change="onWeightChange" />
    <RangeSlider title="Income" :fullRange="incomeRange" unit="currency" @change="onIncomeChange" />

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

const isSingle = ref(true);
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

watch([minAge, maxAge, minHeight, maxHeight, minWeight, maxWeight, minIncome, maxIncome, gender, isSingle], () => {
    callPercentageApi();
});


async function callPercentageApi() {
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
            isSingle: isSingle.value,
        },
    });

    if (error) {
        console.error(error);
        return;
    }
    if (data) {
        console.log("Total percentage: " + data.totalPercentage);
        updateTotalPercentage(data);
    }
}


async function onAgeChange(range) {
    console.log("Age changed to " + range.min + " - " + range.max);
    minAge.value = range.min;
    maxAge.value = range.max;
}

async function onHeightChange(range) {
    console.log("Height changed to " + range.min + " - " + range.max);
    minHeight.value = range.min;
    maxHeight.value = range.max;
}

async function onWeightChange(range) {
    console.log("Weight changed to " + range.min + " - " + range.max);
    minWeight.value = range.min;
    maxWeight.value = range.max;
}

async function onIncomeChange(range) {
    console.log("Income changed to " + range.min + " - " + range.max);
    minIncome.value = range.min;
    maxIncome.value = range.max;
}

async function onGenderChange(value) {
    console.log('gender changed' + value);
    gender.value = value;
}

async function onSingleChange(value) {
    console.log('single changed' + value);
    isSingle.value = value;
}
</script>