<template>
    <section
        class="range_container flex flex-col w-full mx-auto my-4 p-4 bg-primary bg-opacity-5 shadow-md rounded border-gray-200 border-solid border">
        <fieldset>
            <!-- extra div because flex cant be used on fieldset element
         https://stackoverflow.com/questions/28078681/why-cant-fieldset-be-flex-containers -->
            <div class="flex flex-row flex-wrap gap-2 items-center">
                <legend class="font-semibold text-lg inline-block">{{ props.title }}:</legend>
                <label :for="opt[0]" v-for="opt in options"
                    class=" rounded-full py-1 pr-4 pl-3 border-2 border-solid border-gray-300 flex gap-2 cursor-pointer hover:border-primary has-[:checked]:bg-primary has-[:checked]:bg-opacity-15 transition-colors">
                    <input type="radio" :id="opt[0]" :name="title" :value="opt[0]" v-model="selection"
                        @change="emitChange" class="cursor-pointer accent-primary" />
                    <span class="text-nowrap">{{ opt[1] || opt[0] }}</span>

                </label>
            </div>
        </fieldset>
    </section>
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