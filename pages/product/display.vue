<template>
    <v-div>
        <v-row>
            <v-col cols="8">
                <h2>預覽區</h2>
                <Sample></Sample>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="3">
                <h2>設定區</h2>
                <Create></Create>
            </v-col>
        </v-row>
    </v-div>
</template>
<script setup>
import Create  from '~/pages/product/create.vue'
import Sample from '~/pages/product/sample.vue'
</script>