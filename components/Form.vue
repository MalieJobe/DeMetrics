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
        isSingle: true,
        percetange: 1,
    },
    preferredGender: {
        range: ['total', 'male', 'female'],
        gender: 'total',
        percetange: 1,
    },
})


const { data } = await useAsyncData('ranges', () => queryContent('ranges').only(['age', 'height', 'weight', 'income']).findOne())

for (const key in data.value) {
    formData[key].range = data.value[key].map(item =>
        item === 'Infinity' ? Infinity : item === '-Infinity' ? -Infinity : item
    );
}

const onPreferencesChange = (name, range) => {
    console.log(name + " changed to " + range.min + " - " + range.max);
};

const onDropdownChange = (name, value) => {
    console.log(name + " changed to " + value);
};

</script>
<template>
    <div class="flex flex-row gap-x-10">
        <Dropdown name="gender" :options="formData.preferredGender.range" @change="onDropdownChange" />
        <Dropdown name="isSingle" :options="formData.relationshipStatus.range" @change="onDropdownChange" />
    </div>

    <RangeSlider name="age" :fullRange="formData.age.range" :minStart="20" :maxStart="35" unit="year"
        @change="onPreferencesChange" />

    <RangeSlider name="height" :fullRange="formData.height.range" unit="length" @change="onPreferencesChange" />

    <RangeSlider name="weight" :fullRange="formData.weight.range" @change="onPreferencesChange" />

    <RangeSlider name="income" :fullRange="formData.income.range" unit="currency" @change="onPreferencesChange" />

</template>