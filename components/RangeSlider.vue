<template>
    <div class="range_container">
        <div class="sliders_control">
            <input ref="fromSlider" class="fromSlider" type="range" v-model="range.min" :min="props.from"
                :max="props.to" :step="stepSize" />
            <input ref="toSlider" class="toSlider" type="range" v-model="range.max" :min="props.from" :max="props.to"
                :step="stepSize" :style="{ background: rangeGradient }" />
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['change']);

const props = defineProps({
    from: Number,
    to: Number,
    minStart: Number,
    maxStart: Number,
    stepSize: { type: Number, default: 1 },
});

const range = ref({ min: props.minStart, max: props.maxStart });
const rangeGradient = ref('');

watch(range, () => {
    if (range.value.min > range.value.max) {
        range.value.max = range.value.min;
    }
    if (range.value.max < range.value.min) {
        range.value.min = range.value.max;
    }
    rangeGradient.value = calculateGradient('#C6C6C6', '#25daa5');
    emitRange();
}, { deep: true });

onMounted(() => {
    rangeGradient.value = calculateGradient('#C6C6C6', '#25daa5');
});

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const emitRange = debounce(() => {
    emit('change', range.value);
});


function calculateGradient(baseColor, activeColor) {
    const rangeDistance = props.to - props.from;
    const fromPosition = range.value.min;
    const toPosition = range.value.max;
    return `linear-gradient(
      to right,
      ${baseColor} 0%,
      ${baseColor} ${(fromPosition) / (rangeDistance) * 100}%,
      ${activeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
      ${activeColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${baseColor} ${(toPosition) / (rangeDistance) * 100}%, 
      ${baseColor} 100%)`;
}

</script>

<style>
.range_container {
    display: flex;
    flex-direction: column;
    width: 80%;
    margin: 100px auto;
}

.sliders_control {
    position: relative;
    min-height: 50px;
}


input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    pointer-events: all;
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #C6C6C6;
    cursor: pointer;
}

input[type=range]::-moz-range-thumb {
    -webkit-appearance: none;
    pointer-events: all;
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #C6C6C6;
    cursor: pointer;
}

input[type=range]::-webkit-slider-thumb:hover {
    background: #f7f7f7;
}

input[type=range]::-webkit-slider-thumb:active {
    box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
    -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
}



input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 2px;
    width: 100%;
    position: absolute;
    background-color: #C6C6C6;
    pointer-events: none;
}

.fromSlider {
    /* i have no idea why height 0 is so important.
     * i debugged this shit for 2 hours and didnt get it.
     * so just leave it i guess
     */
    height: 0 !important;
    z-index: 1;
}
</style>