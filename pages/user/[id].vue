<template>
  <p>匹配到的id</p>
  <span>{{ id }}</span>
</template>
<script setup>
const route = useRoute()
const { id } = route.params
</script>