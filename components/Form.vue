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
        gender: 'all', // options: all, male, female
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
    <RangeSlider name="age" :from="0" :to="100" :minStart="20" :maxStart="90" @change="onRangeChange" />
    <p>Range: {{ selectedRange.min }} - {{ selectedRange.max }}</p>


</template>