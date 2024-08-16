<script setup>
import RangeSlider from './RangeSlider.vue';
const updateTotalPercentage = inject('updateTotalPercentage');

const formData = reactive({
    age: {
        range: [],
        min: null,
        max: null,
        percetange: 1,
    },
    height: {
        range: [],
        min: null,
        max: null,
        percetange: 1,
    },
    weight: {
        range: [],
        min: null,
        max: null,
        percetange: 1,
    },
    income: {
        range: [],
        min: null,
        max: null,
        percetange: 1,
        stepSize: 5000
    },
    relationshipStatus: {
        range: [true, false],
        status: true,
        percetange: 1,
    },
    gender: {
        range: ['total', 'male', 'female'],
        status: 'total',
        percetange: 1,
    },
})


const { data } = await useAsyncData('ranges', () => queryContent('ranges').only(['age', 'height', 'weight', 'income']).findOne())

for (const key in data.value) {
    formData[key].range = data.value[key].map(item =>
        item === 'Infinity' ? Infinity : item === '-Infinity' ? -Infinity : item
    );
}

const apiEndpointMap = {
    age: 'age',
    height: 'height',
    weight: 'weight',
    income: 'income',
    relationshipStatus: 'singles',
    preferredGender: 'gender'
}


async function onPreferencesChange(name, range) {
    console.log(name + " changed to " + range.min + " - " + range.max);
    if (!Object.keys(formData).includes(name)) throw new Error('Invalid range changed');

    formData[name].min = range.min;
    formData[name].max = range.max;

    formData[name].percetange = await getPercentageFromDb(apiEndpointMap[name], {
        minAge: range.min,
        maxAge: range.max,
        gender: formData.gender.status
    });
    console.log(name + " percetange is " + formData[name].percetange);
};

const onDropdownChange = (name, value) => {
    console.log(name + " changed to " + value);
    if (!Object.keys(formData).includes(name)) throw new Error('Invalid dropdown changed');

    formData[name].status = value;
};

watch(
    () => [formData.age.percetange, formData.height.percetange, formData.weight.percetange, formData.income.percetange, formData.relationshipStatus.percetange, formData.gender.percetange],
    ([newAge, newHeight, newWeight, newIncome, newRelationshipStatus, newPreferredGender]) => {
        console.log('factors are: ', newAge, newHeight, newWeight, newIncome, newRelationshipStatus, newPreferredGender);
        updateTotalPercentage(newAge * newHeight * newWeight * newIncome * newRelationshipStatus * newPreferredGender);
    }
);

async function getPercentageFromDb(endpoint, params) {
    const { data, status, error } = await $fetch("/api/" + endpoint, {
        params,
    });
    if (error) throw new Error('Error fetching data from the server');
    return data;
}
</script>
<template>
    <div class="flex flex-row gap-x-10">
        <Dropdown name="gender" :options="formData.gender.range" @change="onDropdownChange" />
        <Dropdown name="isSingle" :options="formData.relationshipStatus.range" @change="onDropdownChange" />
    </div>

    <RangeSlider name="age" :fullRange="formData.age.range" :minStart="20" :maxStart="35" unit="year"
        @change="onPreferencesChange" />

    <RangeSlider name="height" :fullRange="formData.height.range" unit="length" @change="onPreferencesChange" />

    <RangeSlider name="weight" :fullRange="formData.weight.range" @change="onPreferencesChange" />

    <RangeSlider name="income" :fullRange="formData.income.range" unit="currency" @change="onPreferencesChange" />

</template>