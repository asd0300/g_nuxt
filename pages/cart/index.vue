<template>
    <v-div>
        <v-alert v-model="IsFinishPay" text="結帳成功" type="info" variant="tonal" closable
            close-label="Close Alert"></v-alert>
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
                <p>勾選以購買</p>
                <v-div v-for="(item, index,) in resultCarts">
                    <v-card height="175" class="ma-6">
                        <v-row>
                            <v-col cols="1" offset="0">
                                <v-checkbox v-model="selectCartItem" :value="item.cartid"></v-checkbox>
                            </v-col>
                            <v-col cols="2" offset="1">
                                <img class="pa-1" :src="item.titlepic" width="120">
                            </v-col>
                            <v-col cols="4" offset="1">
                                <p>{{ item.title }}</p>
                                <p>單品價格:
                                <div v-show="item.newprice == 0">NT${{ item.price }}</div>
                                <div v-show="item.newprice != 0" style="color: red;">NT${{ item.newprice }}</div>
                                </p>
                                <p v-if="item.spec">規格:{{ item.spec }}</p>
                                <p>數量:{{ item.numberbuy }}</p>
                                <p v-show="!item.newprice">項目總價格:{{ item.numberbuy * item.price }}</p>
                                <p v-show="item.newprice">項目折價後總價格:
                                    <span style="color: red;">
                                        NT${{ item.numberbuy * item.newprice }}
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

                </v-div>
                <v-row justify="center">
                    <v-dialog v-model="dialog" persistent width="auto">
                        <v-card>
                            <v-card-title class="text-h5">
                                Delete?
                            </v-card-title>
                            <v-card-text>將刪除 "{{ waitDitem.title }}"
                                <p v-show="waitDitem.spec"> 規格 "{{ waitDitem.spec }}"</p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green-darken-1" variant="text" @click="ToggleDiaYes(waitDitem)">
                                    Yes
                                </v-btn>
                                <v-btn color="green-darken-1" variant="text" @click="ToggleDia(waitDitem)">
                                    No
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
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
    </v-div>
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
const selectCartItem = ref([])
const IsFinishPay =ref(false)
const waitDitem = ref<Cart>({
    userid: 0,
    productid: 0,
    numberbuy: 0,
    spec: "",
    createtime: new Date(),
    id: 0,
    title: "",
    price: 0,
    newprice: 0,
    titlepic: "",
    otherpic: "",
    createdate: new Date(),
    cartid: 0,
    ispay: false
})
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
            isSubmitting.value = false;
            console.log(selectCartItem.value)
            selectCartItem.value.forEach(element => {
                DeleteCartItem(element)
            });
            selectCartItem.value = [] //結帳完後清除
            IsFinishPay.value = true
        }
    }

};

async function DeleteCartItem(cartid: number) {
    try {
        let formData = new FormData();
        formData.append('userid', (loginService.loginId).toString());
        formData.append('cartid', (cartid).toString());
        var req = await $fetch(`${runtimeCon.public.hostDev}/v1/carts/delete`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                },
                method: 'POST',
                body: formData
            });
        if (req == "success") {
            // resultCarts.value.splice(index,1)
            resultCarts.value = resultCarts.value.filter((item) => {
                return item.cartid != cartid
            })
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};
function ToggleDia(item: Cart) {
    dialog.value = !dialog.value
    waitDitem.value = item
}
function ToggleDiaYes(item: Cart) {
    DeleteCartItem(item.cartid)
    dialog.value = !dialog.value

}
</script>