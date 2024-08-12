<template>
    <div class="flex flex-row gap-x-2 items-center">
        <label :for="name" class="font-semibold text-lg">{{ capitalize(name) }}</label>
        <select :name="name" :id="name" v-model="selection" @change="emitChange" class="border border-gray-300 rounded">
            <option v-for="opt in options" :value="opt">{{ capitalize(opt) }}</option>
        </select>
    </div>
</template>

<script setup>
const props = defineProps({
    name: { type: String, required: true },
    options: { type: Array, required: true },
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const selection = ref(props.options[0]);
const emit = defineEmits(['selectChange']);
function emitChange() {
    emit('selectChange', selection.value);
}
</script>