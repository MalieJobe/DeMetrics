<template>
    <select :name="name" :id="name" v-model="selection" @change="emitChange">
        <option v-for="opt in options" :value="opt">{{ opt.toUpperCase() }}</option>
    </select>
</template>

<script setup>
const props = defineProps({
    name: { type: String, required: true },
    options: { type: Array, required: true },
});

const selection = ref(props.options[0]);

const emit = defineEmits(['selectChange']);

</script>