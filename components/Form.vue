<script setup>
const bla = ref('bla');
const { data, status, error } = await useFetch('/api/db_connector', {
    params: {
        type: 'age',
        minAge: 20,
        maxAge: 23,
        gender: 'female'
    }
});

console.log(data.value);
</script>
<template>
    <p>hello world</p>
    <p>and {{ data }}</p>
</template>