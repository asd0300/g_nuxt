<template>
    <div>
        <div>
            trace
        </div>
        <v-row>
            <v-col cols="4">
                123
            </v-col>
            <!-- <v-col cols="4">
                <v-window v-model="window" show-arrows>
                    <v-window-item v-for="n in length" :key="n">
                        <v-card height="200px" class="d-flex justify-center align-center">
                            <span class="text-h2">Card {{ n }}</span>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-col> -->
            <v-img img></v-img>
            <v-col cols="4">
                <v-card>
                    <v-img :src="SelectImg"></v-img>
                </v-card>
                <v-item-group selected-class="bg-primary">
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
                <p style="color: red;">NT${{ productInfo?.product.newprice }}</p>
                <div v-for="(item, index) in spec" :key="index">
                    <div v-for="(value, key) in item" :key="key">
                        <!-- item group -->
                        <p>{{ key }}</p>
                        <v-item-group mandatory>
                            <v-container>
                                <v-row>
                                    <v-col v-for="childitem in value" :key="childitem" cols="12" md="4">
                                        <v-item v-slot="{ isSelected, toggle }">
                                            <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center" dark
                                                height="50" @click="toggle">
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
                <v-text-field type="number" min="0" step="any" v-model="number"></v-text-field>
                <!-- 特色 -->
                <v-card>
                    <v-expansion-panels>
                        <v-expansion-panel title="商品特色" :text="feature">
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
                <v-btn @click="AddToCart()">放入購物車</v-btn>
            </v-col>
        </v-row>
        <v-row style="margin: 100;">
            <v-col cols="8" offset="2">
                <v-div v-html="content">
                </v-div>
            </v-col>
        </v-row>
        <!-- 規格 -->
        <p>商品規格</p>
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
        </v-row>
    </div>
</template>
<script lang="ts" setup>
import { loginServiceStore } from '@/stores/loginService'
import { GetUser } from '@/Interface/UserInterface';
import { type ProductIdBack } from '@/Interface/ProductInterface';
const route = useRoute()
const id = route.params.id
const runtimeCon = useRuntimeConfig()
const loginService = loginServiceStore()
const productInfo = ref<ProductIdBack>()
const window = ref(0)
const length = ref(3)
const number = ref(0)
const feature = ref("")
const content = ref("")
const spec = ref<{ [key: string]: string[] }[]>([])
const pics = ref<string[]>([])
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
        var otherpic = productInfo.value.product.otherpic
        if (otherpic != undefined && otherpic.split(",").length > 0) {
            otherpic.split(",").forEach(element => {
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
        var temp = loginService.cookieValue
        productInfo.value = await $fetch<ProductIdBack>(`${runtimeCon.public.hostDev}/v1/cart/${userid}`,
            {
                headers: {

                    'userToken': loginService.cookieValue
                }
            });
        content.value = productInfo.value.productDetail.content
        feature.value = productInfo.value.productDetail.feature
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
function SelectItem(item: string) {
    SelectImg.value = item
}
</script>