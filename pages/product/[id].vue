<template>
    <div>
        <v-alert v-model="IsNotLogin" :text="LoginFailMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="AddNewToCart" :text="AddCartMessage" type="info" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <div>
            <!-- trace -->
        </div>
        <v-row>
            <v-col cols="4">
                <!-- 123 -->
            </v-col>
            <v-img img></v-img>
            <v-col cols="4">
                <v-card>
                    <v-img :src="SelectImg"></v-img>
                </v-card>
                <v-item-group selected-class="bg-primary selected-border">
                    <v-container>
                        <v-row>
                            <v-col v-for="item in pics" :key="item" cols="1" md="4">
                                <v-item v-slot="{ isSelected, selectedClass, toggle }">
                                    <v-card :class="['d-flex align-center', selectedClass]" dark height="50"
                                        @click="SelectItem(item)">
                                        <v-img :src="item"></v-img>
                                    </v-card>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-item-group>
            </v-col>
            <v-col cols="4">
                <h3>{{ productInfo?.product.title }}</h3>
                <div v-show="productInfo?.product.newprice">
                    <p class="text-decoration-line-through">NT${{ productInfo?.product.price }}</p>
                </div>
                <div v-show="!productInfo?.product.newprice">
                    <p>NT${{ productInfo?.product.price }}</p>
                </div>
                <div v-show="productInfo?.product.newprice != 0">
                    <p style="color: red;">NT${{ productInfo?.product.newprice }}</p>
                </div>
                <!-- spec option -->
                <!-- <p>{{ selectedItems }}</p> -->
                <div v-for="(item, index) in spec">
                    <div v-for="(value, key) in item" :key="key">
                        <v-item-group mandatory v-model="selectedItems[index]">
                            <v-container>
                                <p>{{ key }}</p>
                                <v-row>
                                    <v-col v-for="childitem in value" :key="childitem" cols="12" md="4">
                                        <p>{{ childitem }}</p>
                                        <v-item v-slot="{ isSelected, toggle }" :value="childitem">
                                            <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center" dark
                                                height="50" @click="HandleClick(childitem, toggle)">
                                                <v-scroll-y-transition>
                                                    <div class="flex-grow-1 text-center">
                                                        {{ isSelected ? childitem : childitem }}

                                                    </div>
                                                </v-scroll-y-transition>
                                            </v-card>
                                        </v-item>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-item-group>
                    </div>
                </div>
                <!-- 數量 -->
                <p>數量</p>
                <v-text-field type="number" min="1" step="any" v-model="number"></v-text-field>
                <!-- 特色 -->
                <v-card>
                    <v-expansion-panels>
                        <v-expansion-panel :value="true" title="商品特色" :text="feature">
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
                <br>
                <v-btn @click="AddToCart()">放入購物車</v-btn>
            </v-col>
        </v-row>
        <br>
        <v-divider></v-divider>
        <br>
        <v-row style="margin: 100;">
            <v-col cols="6" offset="3">
                <v-div v-html="content">
                </v-div>
            </v-col>
        </v-row>
        <!-- 規格 -->
        <!-- <p>商品規格</p>
        <v-row>
            <v-col cols="8" offset="2">
                <v-table>
                    <thead>
                        <tr>
                            <th v-for="(item, index) in tableHeaders" :key="index">
                                <div v-for="(value, key) in item" :key="key">
                                    <tr v-for="child in value">
                                        <tbody>
                                            <th>{{ key }}{{ child }}</th>
                                        </tbody>
                                    </tr>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index), in tableSpecDetail" :key="item">
                            <td>{{ item }}</td>
                            <td>{{ item }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row> -->
    </div>
</template>
<script lang="ts" setup>
import { loginServiceStore } from '@/stores/loginService'
import { GetUser } from '@/Interface/UserInterface';
import { type ProductIdBack } from '@/Interface/ProductInterface';
import { type ApiError } from '@/Interface/FetchInfoInterface';
const route = useRoute()
const id = route.params.id
const runtimeCon = useRuntimeConfig()
const loginService = loginServiceStore()
const productInfo = ref<ProductIdBack>()
const window = ref(0)
const length = ref(3)
const number = ref(1)
const feature = ref("")
const content = ref("")
const spec = ref<{ [key: string]: string[] }[]>([])
const pics = ref<string[]>([])
const selectedItems = ref<string[]>([])
const IsNotLogin = ref(false)
const LoginFailMessage = ref("")
const AddNewToCart = ref(false)
const AddCartMessage = ref("")
onMounted(async () => {
    await GetUser()
    await GetFullProductinfo()
});
var userid = loginService.loginId
const SelectImg = ref("")
const tableHeaders = ref<{ [key: string]: string[] }[]>([])
const tableSpecDetail = ref<{ [key: string]: string[] }[]>([])
async function GetFullProductinfo() {
    try {
        var temp = loginService.cookieValue
        productInfo.value = await $fetch<ProductIdBack>(`${runtimeCon.public.hostDev}/v1/products/${id}`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                }
            });
        if (productInfo.value.productDetail.spec != undefined) {
            var tempSpec = productInfo.value.productDetail.spec
            var tempSpecDetail = tempSpec.split(";")
            tempSpecDetail = tempSpecDetail.filter(item => item !== "");
            if (tempSpecDetail.length > 0) {
                tempSpecDetail.forEach(element => {
                    var optionchilds: string[] = element.split(',')
                    var one = optionchilds[0]
                    var tempL = []
                    for (var i = 1; i < optionchilds.length; i++) {
                        tempL.push(optionchilds[i])
                        var dic = { [one]: tempL }
                        if (i == 1) {
                            tableHeaders.value.push(dic)
                        }
                        else {
                            tableSpecDetail.value.push(dic)
                        }
                    }
                });
            }

        }
        content.value = productInfo.value.productDetail.content
        feature.value = productInfo.value.productDetail.feature
        var titlepic = productInfo.value.product.titlepic
        pics.value.push(titlepic)
        SelectImg.value = pics.value[0]
        var otherpic = productInfo.value.product.otherpic
        if (otherpic != undefined && otherpic.split(",").length > 0) {
            var otherpics = otherpic.split(",")
            otherpics = otherpics.filter(item => item !== "");
            otherpics.forEach(element => {
                pics.value.push(element)
            });
        }
        var op = productInfo.value.productDetail.option
        if (op != undefined) {
            var options = op.split(";")
            options = options.filter(item => item !== "");
            if (options.length > 0) {
                options.forEach(element => {
                    var optionchilds: string[] = element.split(',')
                    var one = optionchilds[0]
                    var tempL = []
                    for (var i = 1; i < optionchilds.length; i++) {
                        tempL.push(optionchilds[i])
                    }
                    var dic = { [one]: tempL }
                    spec.value.push(dic)
                });
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }

}
async function AddToCart() {
    try {
        let formData = new FormData();
        formData.append('userid', (loginService.loginId).toString());
        formData.append('productid', (id).toString());
        formData.append('numberbuy', (number.value).toString());
        formData.append('spec', (selectedItems.value).toString());
        productInfo.value = await $fetch(`${runtimeCon.public.hostDev}/v1/carts/`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                },
                method: 'POST',
                body: formData
            });
        if(productInfo.value != undefined){
            AddNewToCart.value = true
            AddCartMessage.value = "新增商品至購物車"
        }
    } catch (error: unknown) {
        if ((error as ApiError).status == 401) {
            LoginFailMessage.value = "請先登入帳號"
            IsNotLogin.value = true
            console.error('An error occurred:', error);
        }
    }
}
function SelectItem(item: string) {
    SelectImg.value = item
}
function HandleClick(childitem: string, toggle: (() => void) | undefined) {
    if (toggle != undefined) {
        toggle()
    }
}
</script>
<style>
.v-html-content img {
    max-width: 100%;
    height: auto;
}
</style>