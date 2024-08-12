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

const selectedRange = ref({ min: 0, max: 100 });

const onRangeChange = (range) => {
    console.log(range);
    selectedRange.value = range;
};

</script>
<template>
    <RangeSlider :from="0" :to="100" :minStart="20" :maxStart="90" :stepSize="10" @change="onRangeChange" />
    <p>Range: {{ selectedRange.min }} - {{ selectedRange.max }}</p>


</template>