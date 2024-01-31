<template>
    <v-div>
        <v-row>
            <v-col cols="8">
                <Sample></Sample>
            </v-col>
            <v-col cols="3">
                <Create></Create>
            </v-col>
        </v-row>
    </v-div>
</template>
<script setup>
import Create  from '~/pages/product/create.vue'
import Sample from '~/pages/product/sample.vue'
</script>