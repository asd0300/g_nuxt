<template>
    <div>
        <div>
            <!-- <v-breadcrumbs :items="linkItems">
                <template v-slot:divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </template>
            </v-breadcrumbs> -->
        </div>
        <v-row>
            <v-col cols="4">
                123
            </v-col>
            <v-row>
                <v-col cols="4"></v-col>
                <v-col cols="4">
                    <v-card theme="white" flat rounded="0">
                        <v-window v-model="onboarding">
                            <v-window-item v-for="[key, value] in Object.entries(samplePic)" :key="`card-${key}`"
                                :value="key">
                                <v-card height="200" class="d-flex justify-center align-center">
                                    <span class="text-h2">
                                        Card {{ value }}
                                    </span>
                                </v-card>
                            </v-window-item>
                        </v-window>
                        <v-card-actions class="justify-space-between">
                            <v-btn variant="plain" icon="mdi-chevron-left" @click="prev"></v-btn>
                            <v-item-group v-model="onboarding" class="text-center" mandatory>
                                <v-item v-for="[key, value] in Object.entries(samplePic)" :key="`btn-${key}`"
                                    v-slot="{ isSelected, toggle }" :value="key">
                                    <v-btn :variant="isSelected ? 'outlined' : 'text'" icon="mdi-record"
                                        @click="toggle"><v-img src="">{{ key }}</v-img></v-btn>
                                </v-item>
                            </v-item-group>
                            <v-btn variant="plain" icon="mdi-chevron-right" @click="next"></v-btn>
                        </v-card-actions>
                    </v-card>
                    <div class="bg-white text-center py-6">
                        本商品適用優惠券
                    </div>
                    <v-div>
                        <v-div>
                            <v-row>
                                <v-div class="bg-white text-center py-1" v-for="n in testStrings.slice(0, first5item)">
                                    <v-btn style="background-color: hotpink;">折價券
                                    </v-btn>
                                    <v-btn variant="plain">NT$50折價券馬上領取
                                    </v-btn>
                                </v-div>
                            </v-row>
                            <div>
                                <v-icon v-if="showMorefirst" @click="ShowMore()" icon="mdi-chevron-down"></v-icon>
                                <v-icon v-else @click="ShowLess()" icon="mdi-chevron-up"></v-icon>
                            </div>
                            <!-- "mdi-chevron-down":"mdi-chevron-up" -->
                        </v-div>
                    </v-div>
                </v-col>
                <v-col cols="4">
                    <div>Title
                        <v-img :src="productServicetor.pic"></v-img>
                    </div>
                    <div>{{ productServicetor.price }}</div>
                    <div>
                        <v-slider v-model="defaultNumber" :max="255" :step="1" label="數量" hide-details class="ma-4">
                            <template v-slot:append>
                                <v-text-field v-model="defaultNumber" type="number" style="width: 80px" density="compact"
                                    hide-details variant="outlined"></v-text-field>
                            </template>
                        </v-slider>
                    </div>
                    <div>
                        <v-btn>加入購物車</v-btn>
                        <v-btn>立即結帳</v-btn>
                    </div>
                    <div>

                        付款與運送
                        <p>
                            超取滿NT$490免運
                        </p>
                    </div>
                    <div>
                        |付款方式
                        <v-div v-for="payitem in payment">
                            <p>
                                {{ payitem }}
                            </p>
                        </v-div>
                    </div>
                </v-col>
            </v-row>
        </v-row>
        <v-row>
            <v-col cols="4"></v-col>
            <v-col cols="6">
                <v-div>
                    <p>相關分類</p>
                    <v-chip-group>
                        <v-div v-for="item in relaTargets">
                            <v-chip>{{ item }}</v-chip>
                        </v-div>
                    </v-chip-group>
                </v-div>
                <div>
                    <v-banner :sticky="sticky" lines="one">
                        <template v-slxot:actions>
                            <v-btn variant="plain">
                                <h2>詳細說明</h2>
                            </v-btn>
                            <v-btn variant="plain">
                                <h2>商品規格</h2>
                            </v-btn>
                            <v-btn variant="plain">
                                <h2>相關推薦</h2>
                            </v-btn>
                        </template>
                    </v-banner>
                </div>
                <v-div v-for="picTextItem in itemPictext">
                    <v-row>
                        <v-col>
                            <p v-if="picTextItem.text != ''">{{ picTextItem.text || "" }}</p>
                            <v-img v-if="picTextItem.picInbase64 != ''" :src="picTextItem.picInbase64"></v-img>
                        </v-col>
                    </v-row>
                </v-div>
                <v-row>
                    <v-col cols="2" />
                    <v-col cols="8">
                        <v-table density="compact">
                            <tbody>
                                <tr v-for="(value, key) in spcific" :key="key">
                                    <td>{{ Object.keys(value)[0] }}</td>
                                    <td>{{ Object.values(value)[0] }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
                <div>
                    <v-btn variant="plain">
                        <h2>瀏覽紀錄</h2>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts" setup>
import {productServiceStore} from '@/stores/productService'
import { type PicAndText } from '@/Interface/ProductInterface'
const payment = ref<String[]>(["POYA支付", "信用卡一次付款", "超商取貨付款", "LINE Pay", "Apple Pay", "街口支付", "Google Pay"])
const productServicetor = productServiceStore()
const route = useRoute()
const { id } = route.params
const window = ref(0)
const length = ref(3)
const defaultNumber = ref(1)
const onboarding = ref(1)
const first5item = ref(5)
const sticky = ref(true)
function next() {
    onboarding.value = onboarding.value + 1 > length.value
        ? 1
        : onboarding.value + 1
}
function prev() {
    onboarding.value = onboarding.value - 1 <= 0
        ? length.value
        : onboarding.value - 1
}
const samplePic = ref<{ [key: number]: string }>({});
samplePic.value[1] = "123"
samplePic.value[2] = "456"
samplePic.value[3] = "789"
const testStrings = ref<String[]>([])
testStrings.value.push("a")
testStrings.value.push("b")
testStrings.value.push("c")
testStrings.value.push("d")
testStrings.value.push("e")
testStrings.value.push("f")
const showMorefirst = ref(true)
function ShowMore() {
    first5item.value = testStrings.value.length
    showMorefirst.value = !showMorefirst
}
function ShowLess() {
    first5item.value = 5
    showMorefirst.value = !showMorefirst
}
const relaTargets = ref<String[]>(["緊緻 臉部保養", "緊緻 玻尿酸", "抗老 臉部保養"])

const itemPictext = ref<PicAndText[]>([{
    text: "", picInbase64: 'https://ims-static.91app.com/IMS/Images/332/Product/7801bf65-280a-4b2c-bf47-4d0470c94f37'
}, {
    text: "", picInbase64: 'https://ims-static.91app.com/IMS/Images/332/Product/ab5700a9-9e6c-4c00-84e6-bf71d777fa5f'
}])
const spcific = ref<{ [key: string]: string }[]>([
    { "品牌": "DR.WU" },
    { "規格": "單入組" },
    { "適用於": "全膚質適用" },
    { "功效": "保濕、控油、緊緻、舒敏、修護、舒緩" },
    { "容量": "15ml" },
    { "保存期限": "36個月" },
    { "質地": "液狀" },
    { "產地": "台灣" },
]);
const linkItems = ref<{ [key: string]: string|boolean }[]>([
    {
        title: 'Dashboard',
        disabled: false,
        href: 'breadcrumbs_dashboard',
    },
    {
        title: 'Link 1',
        disabled: false,
        href: 'breadcrumbs_link_1',
    },
    {
        title: 'Link 2',
        disabled: true,
        href: 'breadcrumbs_link_2',
    },
])
</script>