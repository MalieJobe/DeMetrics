<template>
    <div class="flex flex-col gap-y-2 my-8 items-center">
        <div v-for="faq in props.faqs" :key="faq.teaser" class="text-left w-full">
            <div @click="() => changeState(faq.teaser)" @keyup.space="() => changeState(faq.teaser)" tabindex="0"
                class="text-lg bg-primary bg-opacity-25 hover:bg-opacity-40 rounded
                        px-3 py-2 cursor-pointer flex justify-between transition-colors">
                <h5
                    class="font-medium">
                    {{ faq.teaser }}
                </h5>
                <span :class="{'rotate-180': (expanededOne === faq.teaser)}"
                    class=" duration-300 transition-transform pl-2">&#9660;</span>
            </div>
            <div :class="{'max-h-96 py-2': (expanededOne === faq.teaser)}"
                class="max-h-0 transition-all duration-300 collapsible overflow-hidden 
                bg-primary bg-opacity-10 px-3 rounded-b">
                {{ faq.reveal }}
            </div>

        </div>
    </div>
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