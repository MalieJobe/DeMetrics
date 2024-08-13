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
        range: ["underweight", "normal", "overweight", "obese"],
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

const fetchSingleRange = async (tableName, columnMin, columnMax) => {
    const { data, status, error } = await useFetch('/api/getFullRangeFromTable', {
        params: {
            tableName,
            columnMin,
            columnMax,
        }
    });
    return data;
}

formData.age.range = await fetchSingleRange('age', 'age_min', 'age_max');
formData.height.range = await fetchSingleRange('height', 'height_min', 'height_max');
formData.income.range = await fetchSingleRange('income', 'income_min', 'income_max');

console.log(formData)

const onPreferencesChange = (name, range) => {
    console.log(name + " changed to " + range.min + " - " + range.max);
};

const onDropdownChange = (name, value) => {
    console.log(name + " changed to " + value);
};

</script>
<template>
    <div class="flex flex-row gap-x-10">
        <Dropdown name="gender" :options="['all', 'male', 'female']" @change="onDropdownChange" />
        <Dropdown name="isSingle" :options="['true', 'false']" @change="onDropdownChange" />
    </div>

    <RangeSlider name="age" :from="0" :to="100" :minStart="20" :maxStart="90" unit="year"
        @change="onPreferencesChange" />

    <RangeSlider name="height" :from="150" :to="273" :minStart="165" :maxStart="185" unit="length"
        @change="onPreferencesChange" />

    <RangeSlider name="weight" :from="1" :to="4" :minStart="1" :maxStart="4" @change="onPreferencesChange" />

    <RangeSlider name="income" :from="-0" :to="1000000" :minStart="15000" :maxStart="120000" :stepSize="5000"
        unit="currency" @change="onPreferencesChange" />

</template>