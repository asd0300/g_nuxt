<template>
    <v-row v-show="resultCarts.length == 0">
        <p>購物車目前無商品</p>
    </v-row>
    <v-row v-show="resultCarts.length != 0">
        <v-col cols="7" offset="2">
            <v-div v-for="item in resultCarts">
                <v-card height="150" class="ma-6">
                    <v-row>
                        <v-col cols="2" offset="1">
                            <img class="pa-1" :src="item.titlepic" width="100">
                        </v-col>
                        <v-col cols="5" offset="1">
                            <p>{{ item.title }}</p>
                            <p>單品價格:
                            <div v-show="item.price" class="text-decoration-line-through">NT${{ item.price }}</div>
                            <div style="color: red;">NT${{ item.newprice }}</div>
                            </p>
                            <p>數量:{{ item.numberbuy }}</p>
                            <p v-show="!item.newprice">項目總價格:{{ item.numberbuy * item.price }}</p>
                            <p v-show="item.newprice">項目折價後總價格:
                                <span style="color: red;">
                                    {{ item.numberbuy * item.newprice }}
                                </span>
                            </p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-div>
        </v-col>
        <v-col>
            <p>總金額 {{ titlePrice }}</p>
            <v-btn>結帳</v-btn>
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { type Cart } from '@/Interface/CartInterface';
import { GetUser } from '@/Interface/UserInterface';
const route = useRoute()
const runtimeCon = useRuntimeConfig()
const loginService = loginServiceStore()
const titlePrice = ref(0)
onMounted(async () => {
    await GetUser()
    await GetAllCartByUID()
    await CountAll()
});
const userId = loginService.loginId
const resultCarts = ref<Cart[]>([])
async function GetAllCartByUID() {
    try {
        resultCarts.value = await $fetch<Cart[]>(`${runtimeCon.public.hostDev}/v1/carts/${loginService.loginId}`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                }
            });
        console.log(resultCarts)
        var tmp = resultCarts.value[0].title
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
async function CountAll() {
    titlePrice.value = 0
    resultCarts.value.forEach(element => {
        if (element.newprice) {
            titlePrice.value += element.newprice * element.numberbuy
        }
        else {
            titlePrice.value += element.price * element.numberbuy
        }

    });
}
</script>