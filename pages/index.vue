<template>
    <div>
        <v-card>
            <v-card-title class="text-h5 font-weight-regular bg-blue-grey">
                <v-row style="background-color: pink;">
                    <v-col>
                        Profile
                    </v-col>
                    <v-col :offset="6">
                        <div>
                            <v-div v-show="!IsLogin">
                                <v-dialog width="500">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" text="登入"> </v-btn>
                                    </template>
                                    <template v-slot:default="{ isActive }">
                                        <v-card width="auto" height="500">
                                            <v-card-text>
                                                <div v-show="LoginOrRegister">
                                                    <Login />
                                                    <v-btn @click="LoginOrRegister = !LoginOrRegister">前往註冊</v-btn>
                                                </div>
                                                <div v-show="!LoginOrRegister">
                                                    <Register />
                                                    <v-btn @click="LoginOrRegister = !LoginOrRegister">前往登入</v-btn>
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </template>
                                </v-dialog>
                            </v-div>
                            <v-btn v-show="IsLogin">
                                welcome back, {{ loginUserName }}
                            </v-btn>
                            <v-badge :content="1">
                                <v-icon :icon="'mdi-cart-outline'" size="small" @click="ShowCartStatus()" ></v-icon>
                            </v-badge>
                        </div>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="3" :offset="3" md="4">
                            <v-text-field v-model="keywordSearch" :rules="[rules.required]" label="input search words">

                            </v-text-field>
                        </v-col>
                        <v-col cols="1">
                            <v-icon :key="`icon-${isEditing}`" :color="isEditing ? 'success' : 'info'" :icon="'mdi-magnify'"
                                size="x-large" @click=""></v-icon>
                        </v-col>
                        <v-col>
                            <v-btn append-icon="$vuetify" variant="tonal" @click="advToggle = !advToggle">
                                進階搜尋
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-card-text v-show="advToggle">
                            <v-row>
                                <v-col cols="3">
                                    <div>查詢模式:</div>
                                    <v-radio-group>
                                        <v-row>
                                            <v-radio label="精確" value="0"></v-radio>
                                            <v-radio label="模糊" value="1"></v-radio>
                                        </v-row>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="5" :offset="1">
                                    <div>時間查詢:</div>
                                    <v-radio-group>
                                        <v-row>
                                            <v-radio label="全部" value="all"></v-radio>
                                            <v-radio label="一個月內" value="M1"></v-radio>
                                            <v-radio label="半年內" value="HY"></v-radio>
                                            <v-radio label="一年內" value="Y1"></v-radio>
                                            <v-radio label="一年以上" value="A1Y"></v-radio>
                                        </v-row>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="2" :offset="1">
                                    <div>每頁筆數:</div>
                                    <v-select v-model="select" :items="numberArray" item-title="state" item-value="abbr"
                                        persistent-hint return-object single-line></v-select>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-row>
                </v-form>
                <v-row>
                </v-row>
            </v-card-text>
            <v-card-text v-show="false">
                <div class="block no_result text_center" id="no_result" v-show="!IsSearchSuccessResponse">
                    <p>尚未有查詢結果</p>
                </div>
            </v-card-text>
            <v-card-text v-show="true">
                <div class="block no_result text_center" id="no_result" v-show="!IsSearchSuccessResponse">
                    <v-row>
                        <v-col cols="3">
                            <v-card>
                                <v-card-title>
                                    篩選條件
                                </v-card-title>
                                <v-form>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="secondSearch" label="在搜尋結果中查詢">
                                            </v-text-field>
                                            <v-expansion-panels>
                                                <v-expansion-panel>
                                                    <v-expansion-panel-title>
                                                        <template v-slot:default="{ expanded }">
                                                            <v-row no-gutters>
                                                                <v-col cols="4" class="d-flex justify-start">
                                                                    檔案類型
                                                                </v-col>
                                                                <v-col cols="8" class="text-grey">
                                                                    <v-fade-transition leave-absolute>
                                                                        <v-container fluid>
                                                                        </v-container>
                                                                    </v-fade-transition>
                                                                </v-col>
                                                            </v-row>
                                                        </template>
                                                    </v-expansion-panel-title>
                                                    <v-expansion-panel-text>
                                                        <div class="d-flex flex-column mb-6">

                                                        </div>
                                                    </v-expansion-panel-text>
                                                </v-expansion-panel>
                                                <v-expansion-panel>
                                                    <v-expansion-panel-title>
                                                        <template v-slot:default="{ expanded }">
                                                            <v-row no-gutters>
                                                                <v-col cols="4" class="d-flex justify-start">
                                                                    資料來源
                                                                </v-col>
                                                                <v-col cols="8" class="text-grey">
                                                                    <v-fade-transition leave-absolute>
                                                                        <v-container fluid>
                                                                        </v-container>
                                                                    </v-fade-transition>
                                                                </v-col>
                                                            </v-row>
                                                        </template>
                                                    </v-expansion-panel-title>
                                                    <v-expansion-panel-text>
                                                        <div class="d-flex flex-column mb-6">

                                                        </div>
                                                    </v-expansion-panel-text>
                                                </v-expansion-panel>
                                            </v-expansion-panels>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-row>
                                <v-col cols="3">
                                    <v-row>
                                        <div :class="['text-h5', 'pa-2']">共有<strong
                                                class="text-red-lighten-1">3</strong>個搜尋結果
                                        </div>
                                    </v-row>
                                </v-col>
                                <v-col cols="3" :offset="6">
                                    <v-row>
                                        <div :class="['text-h6', 'pa-2']">排序方式:</div>
                                        <v-btn-toggle v-model="selectFilterMode" variant="text" color="blue-darken-4">
                                            <v-btn value="時間">
                                                時間
                                            </v-btn>
                                            <v-btn value="詞頻">
                                                詞頻
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-row>
                                </v-col>
                                <v-row>
                                    <v-col cols="3" v-for="product in productitems" :key="product.title">
                                        <v-card>
                                            <v-img :src="product.titlepic" class="align-end"
                                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover>                                            
                                            </v-img>
                                            <v-card-text>
                                                <div>{{ product.title }}</div>
                                                <div class="text-decoration-line-through">NT${{ product.price }}</div>
                                                <div style="color: red;">NT${{ product.newprice }}</div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn size="small" color="surface-variant" variant="text"
                                                    icon="mdi-heart"></v-btn>

                                                <v-btn size="small" color="surface-variant" variant="text"
                                                    icon="mdi-cart-outline" @click=""></v-btn>

                                                <v-btn size="small" color="surface-variant" variant="text"
                                                    icon="mdi-share-variant"></v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card>
        <v-alert v-model="IsEmptyAlert" text="查詢句不可為空" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsNotLogin" :text="LoginFailMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <!-- <v-alert v-model="showLoginMessage" text="登入成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert> -->
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { type Product, type ResponseData } from '~/Interface/SearchInterface'
import Login from '~/pages/user/login.vue'
import Register from '~/pages/user/register.vue'
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
onMounted(async () => {
    await GetUserName()
    await FetchData()
});
const LoginOrRegister = ref(true)
const runtimeCon = useRuntimeConfig()
const IsLogin = ref(false)
const showLoginMessage = ref(false)
const IsNotLogin = ref(false)
const LoginFailMessage = ref("")
const loginUserName = ref("")
const username = ref("")
const password = ref("")
const secondSearch = ref("")
const keywordSearch = ref('')
const isEditing = ref(false)
const advToggle = ref(false)
const productitems = ref<Product[]>([])
const select = ref(1)
const selected = ref<String[]>([])
const typeCheckList = ref<String[]>([])
const sourceCheckList = ref<String[]>([])
const IsSearchSuccessResponse = ref(false)
const selectFilterMode = ref("時間")
const numberArray = ref(Array.from({ length: 100 }, (num, i) => i + 1))
const availableFile = ref([{ label: "MS-Word文件檔" }, { label: "MS-Excel文件檔" }, { label: "MS-Power Point文件檔" }, { label: "OpenDocument文件檔（含ODT、ODP、ODS）" },
{ label: "HTML網頁檔" }, { label: "PDF列印檔（Portable Document Format）" }, { label: "ZIP壓縮檔" }, { label: "不限" }])
const checkIndexPool: { [key: string]: boolean } = {};
const checkFileTypePool: { [key: string]: boolean } = {};

const rules = {
    required: (value: any) => !!value || 'Required.',
    counter: (value: string | any[]) => value.length != 20 || 'Max 20 characters',
    email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
};

//pagination
const itemsOnPage = ref(1)

//alert
const IsEmptyAlert = ref(false)
const alertMessage = ref("")
const router = useRouter();
const navigateToUserCreate = () => {
    router.push('/user')
}
watch(IsLogin, (newvalue, oldvalue) => {
    if (newvalue == true) {
        showLoginMessage.value = true
    }
});
const FetchData = async () => {
    try {
        productitems.value = await $fetch<Product[]>(`${runtimeCon.public.hostDev}/v1/products/`)
        // if (response.error) {
        //   console.error('Error fetching data:', response.error)
        // } else {
        //     productitems.value = response.value
        // }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
async function GetUserName() {
    const cookieValue = Cookies.get('userToken');
    if (cookieValue != null) {
        console.log(cookieValue)
        console.log("解析后的token：", jwtDecode(cookieValue).username)
        IsLogin.value = true
        loginUserName.value = jwtDecode(cookieValue).username
    }
    else {
        console.log("Can't find token")
    }
}
function ShowCartStatus(){
    console.log("check cart")
}
</script>