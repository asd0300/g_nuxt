<template>
    <div>
        <div>
            trace
        </div>
        <v-row>
            <v-col cols="4">
                123
            </v-col>
            <v-col cols="4">
                <v-window v-model="window" show-arrows>
                    <v-window-item v-for="n in length" :key="n">
                        <v-card height="200px" class="d-flex justify-center align-center">
                            <span class="text-h2">Card {{ n }}</span>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-col>
            <v-col cols="4">
                789
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts" setup>
const route = useRoute()
const { id } = route.params
const window = ref(0)
const length = ref(3)
</script>