<template>
    <div class="flex flex-row gap-x-2 items-center">
        <label :for="title" class="font-semibold text-lg">{{ props.title }}</label>
        <select :name="title" :id="title" v-model="selection" @change="emitChange"
            class="border border-gray-300 rounded">
            <option v-for="opt in options" :value="opt[0]">{{ opt[1] || opt[0] }}</option>
        </select>
    </div>
</template>

<script setup>
const props = defineProps({
    title: { type: String, required: true },
    options: { type: Array, required: true },
});

const selection = ref(props.options[0][0]);
const emit = defineEmits(['change']);
function emitChange() {
    emit('change', selection.value);
}
</script>