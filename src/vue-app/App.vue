<script  setup>
import { ref } from 'vue';

const counter = ref(0);
</script>

<template>
    <div @click="() => counter++">Count: {{ counter }}</div>
</template>