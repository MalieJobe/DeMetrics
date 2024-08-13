<script setup>
import RangeSlider from './RangeSlider.vue';

// const { data, status, error } = await useFetch('/api/db_connector', {
//     params: {
//         type: 'age',
//         minAge: 20,
//         maxAge: 23,
//         gender: 'female'
//     }
// });

const totalPercentage = inject('totalPercentage');

const formData = reactive({
    age: {
        min: null,
        max: null,
        percetange: 1,
    },
    height: {
        min: null,
        max: null,
        percetange: 1,
    },
    weight: {
        min: null,
        max: null,
        percetange: 1,
    },
    income: {
        min: null,
        max: null,
        percetange: 1,
        stepSize: 5000
    },
    relationshipStatus: {
        isSingle: true,
        percetange: 1,
    },
    preferredGender: {
        gender: 'total', // options: total, male, female
        percetange: 1,
    },
})


const selectedRange = ref({ min: 0, max: 100 });

const onRangeChange = (range) => {
    console.log("parent", range);
    selectedRange.value = range;
};

</script>
<template>
    <div class="flex flex-row gap-x-10">
        <Dropdown name="gender" :options="['all', 'male', 'female']" />
        <Dropdown name="isSingle" :options="['true', 'false']" />
    </div>

    <RangeSlider name="age" :from="0" :to="100" :minStart="20" :maxStart="90" unit="year" @change="onRangeChange" />

    <RangeSlider name="height" :from="150" :to="273" :minStart="165" :maxStart="185" unit="length"
        @change="onRangeChange" />
    <RangeSlider name="weight" :from="1" :to="4" :minStart="1" :maxStart="4" @change="onRangeChange" />
    <RangeSlider name="income" :from="-0" :to="1000000" :minStart="15000" :maxStart="120000" :stepSize="5000"
        unit="currency" @change="onRangeChange" />

</template>