<template>
    <button class="tooltip relative" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
        <pre class="text-sm border border-black border-solid rounded-full w-5 h-5"
            :class="{ 'hover:text-pink-500 border-pink-500': showTooltip }">i</pre>
        <Transition>
            <div v-if="showTooltip" class="tooltip-content absolute top-[-10px] right-0 translate-y-[-100%]
                min-w-36 text-left bg-white border border-slate-200 border-solid
                shadow-md rounded p-2">
                {{ props.content }}
            </div>
        </Transition>
    </button>
</template>

<script setup>
const showTooltip = ref(false);

const props = defineProps(['content']);
</script>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>