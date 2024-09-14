<template>
    <section class="flex flex-col gap-y-2 my-20" aria-label="FAQs">
        <div v-for="faq in props.faqs" :key="faq.teaser" class="text-left w-full">
            <div @click="() => changeState(faq.teaser)" @keyup.space="() => changeState(faq.teaser)" tabindex="0"
                class="text-md bg-primary bg-opacity-15 hover:bg-opacity-30 rounded
                        px-3 py-2 cursor-pointer flex justify-between items-center transition-colors">
                <h3
                    class="font-medium pr-2">
                    {{ faq.teaser }}
                </h3>
                <span :class="{'rotate-180': (expanededOne === faq.teaser)}"
                    class=" duration-300 transition-transform">&#9660;</span>
            </div>
            <p v-html="faq.reveal" 
                :class="{'max-h-96 py-2': (expanededOne === faq.teaser)}"
                class="max-h-0 transition-all duration-300 collapsible overflow-hidden text-sm
                bg-primary bg-opacity-5 px-3 rounded-b border border-t-0 border-gray-200">
            </p>

        </div>
    </section>
</template>

<script setup>

const props = defineProps({
    faqs: Array,
});

const expanededOne = ref(props.faqs[0].teaser);

const changeState = (id) => {
    if (expanededOne.value === id) expanededOne.value = null;
    else expanededOne.value = id;
};
</script>