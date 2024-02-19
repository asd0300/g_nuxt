<template>
    <v-container v-show="resultCarts.length == 0">
        <v-row no-gutters style="height: 150px;">
            <v-col cols="6" offset="5">
                <v-sheet class="pa-2 ma-2">
                    <p>購物車目前無商品</p>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
    <v-row v-show="resultCarts.length != 0">
        <v-col cols="7" offset="2">
            <v-div v-for="(item, index,) in resultCarts">
                <v-card height="15%" class="ma-6">
                    <v-row>
                        <v-col cols="2" offset="1">
                            <img class="pa-1" :src="item.titlepic" width="120">
                        </v-col>
                        <v-col cols="5" offset="1">
                            <p>{{ item.title }}</p>
                            <p>單品價格:
                            <div v-show="item.newprice==0">NT${{ item.price }}</div>
                            <div v-show="item.newprice!=0" style="color: red;">NT${{ item.newprice }}</div>
                            </p>
                            <p>數量:{{ item.numberbuy }}</p>
                            <p v-show="!item.newprice">項目總價格:{{ item.numberbuy * item.price }}</p>
                            <p v-show="item.newprice">項目折價後總價格:
                                <span style="color: red;">
                                    {{ item.numberbuy * item.newprice }}
                                </span>
                            </p>
                        </v-col>
                        <v-col cols="1" offset="1">
                            <!-- <v-btn size="small" color="surface-variant" variant="text" @click="DeleteCartItem(item)"> -->
                            <v-btn size="small" color="surface-variant" variant="text" @click="ToggleDia(item)">
                                <v-icon>
                                    mdi-delete-circle-outline
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
                <v-row justify="center">
                    <v-dialog v-model="dialog" persistent width="auto">
                        <!-- <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props">
                        Open Dialog
                    </v-btn>
                </template> -->
                        <v-card>
                            <v-card-title class="text-h5">
                                Delete?
                            </v-card-title>
                            <v-card-text>將刪除{{item.title}}</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green-darken-1" variant="text" @click="DeleteCartItem(item,index)">
                                    Yes
                                </v-btn>
                                <v-btn color="green-darken-1" variant="text" @click="ToggleDia(item)">
                                    No
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
            </v-div>
            <h3>總金額 {{ titlePrice }}</h3>
            <!-- <v-btn @click="FetchClientFromBackend()">測試</v-btn> -->
            <div>
                <v-card height="150" title="請輸入信用卡資訊" subtitle="請輸入卡號，驗證碼等資訊">
                    <v-div id="card-element" style="margin: 100;">
                    </v-div>
                    <v-btn style="margin: 0,100,0,0;" @click=HandlePayment()>確認</v-btn>
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { type Cart, type BackEndRes } from '@/Interface/CartInterface';
import { GetUser } from '@/Interface/UserInterface';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement, StripeCardNumberElement } from '@stripe/stripe-js';
const route = useRoute()
const runtimeCon = useRuntimeConfig()
const stripePromise = loadStripe(runtimeCon.public.StripePk);
const loginService = loginServiceStore()
const titlePrice = ref(0)
const dialog = ref(false)
const card = ref<StripeCardElement | StripeCardNumberElement | { token: string; }>()
let elements: StripeElements;
onMounted(async () => {
    await GetUser()
    await GetAllCartByUID()
    await CountAll()
    const stripe: Stripe | null = await stripePromise;
    if (!stripe) {
        console.error('Stripe初始化失敗');
        return;
    }
    elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    if (cardElement != undefined) {
        card.value = cardElement;
    }
});
const userId = loginService.loginId
const resultCarts = ref<Cart[]>([])
const clientSk = ref("")
const isSubmitting = ref(false)
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
async function FetchClientFromBackend() {
    try {
        var req = await $fetch<BackEndRes>(`${runtimeCon.public.hostDev}/v1/carts/create-payment-intent`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                },
                method: 'POST',
                body: {
                    "amount": titlePrice.value
                }
            });
        clientSk.value = req.clientSecret
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
async function HandlePayment() {
    isSubmitting.value = true;
    const stripe: Stripe | null = await stripePromise;
    if (!stripe || !elements || !card) {
        console.error('Stripe未正確初始化');
        isSubmitting.value = false;
        return;
    }
    await FetchClientFromBackend(); // 应该从后端获取
    const clientSecret: string = clientSk.value
    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card.value!,
            billing_details: { name: 'Ben' },
        },
    });

    if (result.error) {
        console.error(result.error.message);
        isSubmitting.value = false;
    } else {
        if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            console.log('Payment successful');
            isSubmitting.value = false;
        }
    }

};

async function DeleteCartItem(cartItem: Cart,index:number) {
    try {
        let formData = new FormData();
        formData.append('userid', (loginService.loginId).toString());
        formData.append('productid', (cartItem.productid).toString());
        var req = await $fetch(`${runtimeCon.public.hostDev}/v1/carts/delete`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                },
                method: 'POST',
                body: formData
            });
        if (req == "success"){
            resultCarts.value.splice(index,1)
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};
function ToggleDia(item:Cart){
    dialog.value = !dialog.value

}
</script>