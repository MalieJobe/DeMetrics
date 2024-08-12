<template>
    <input type="range">
</template>

<script setup>
// todo move to utils or plugins
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

</script>