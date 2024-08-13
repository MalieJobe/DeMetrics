<template>
    <section class="range_container flex flex-col w-full mx-auto my-4 p-4 bg-blue-50">
        <aside class="flex justify-between items-center">
            <h3 class="text-xl font-bold">{{ capitalize(props.name) }}</h3>
        </aside>
        <div class="sliders_control relative min-h-5 mt-5">
            <input class="fromSlider" type="range" v-model.number="range.min" :min="props.from" :max="props.to"
                :step="stepSize" @input="updateSliderPosition" />
            <input class="toSlider" type="range" v-model.number="range.max" :min="props.from" :max="props.to"
                :step="stepSize" :style="{ background: rangeGradient }" @input="updateSliderPosition" />
        </div>
        <div class="flex justify-between mt-2 items-center">
            <div class="flex-1">
                <span class="minmax whitespace-nowrap">{{ formatNumber(props.from, props.unit) }}</span>
            </div>
            <div class="flex-1 text-center">
                <span class=" bg-secondary bg-opacity-30 font-bold py-1 px-3 rounded whitespace-nowrap">
                    {{ formatNumber(range.min, props.unit) }} - {{ formatNumber(range.max, props.unit) }}
                </span>
            </div>
            <div class="flex-1 text-right">
                <span class="minmax minmax--left whitespace-nowrap">{{ formatNumber(props.to, props.unit) }}</span>
            </div>
        </div>
    </section>
</template>

<script setup>
const emit = defineEmits(['change']);

const props = defineProps({
    name: { type: String, required: true },
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    minStart: { type: Number, required: true },
    maxStart: { type: Number, required: true },
    stepSize: { type: Number, default: 1 },
    unit: { type: String }
});

const range = ref({ min: props.minStart, max: props.maxStart });
const rangeGradient = ref('');
const rangeActiveColor = "#e364b3";

function updateSliderPosition(event) {
    if (range.value.min > range.value.max) {
        const activeSlider = event.target.classList.contains('fromSlider') ? 'from' : 'to';
        if (activeSlider === 'from') {
            range.value.max = range.value.min;
        } else {
            range.value.min = range.value.max;
        }
    }
    rangeGradient.value = calculateGradient('#C6C6C6', rangeActiveColor);
    emitRange();
}

onMounted(() => {
    console.log("mounted", range.value.min, range.value.max);
    rangeGradient.value = calculateGradient('#C6C6C6', rangeActiveColor);
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
    emit('change', props.name, range.value);
});

function calculateGradient(baseColor, activeColor) {
    const rangeDistance = props.to - props.from;
    const fromPosition = range.value.min - props.from;
    const toPosition = range.value.max - props.from;
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

<style lang="postcss">
.minmax {
    @apply bg-gray-200 py-1 px-2 rounded text-sm relative;
}

.minmax::before {
    content: "";
    border-width: 10px;
    top: 10px;
    left: 0;
    transform: translateY(-100%);
    position: absolute;
    border-color: transparent transparent transparent #e5e7eb;
    /* Triangle color */
}

.minmax--left::before {
    right: 0;
    left: auto;
    border-color: transparent #e5e7eb transparent transparent;
}


/** Code for slider from
 *  https://codepen.io/predragdavidovic/pen/mdpMoWo
 */

input[type=range]::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    pointer-events: all;
    width: 24px;
    height: 24px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px #C6C6C6;
    cursor: pointer;
}

input[type=range]:first-child::-webkit-slider-thumb {
    transform: translateX(-5px);
}

input[type=range]::-moz-range-thumb {
    appearance: none;
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