<template>
    <div>
        <v-alert v-model="IsEmptyAlert" text="查詢句不可為空" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsNotLogin" :text="LoginFailMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="AddNewToCart" :text="AddCartMessage" type="info" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <!-- <v-alert v-model="showLoginMessage" text="登入成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert> -->
        <v-card>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="3" :offset="3" md="4">
                            <v-text-field v-model="keywordSearch" :rules="[rules.required]" label="input search words">

                            </v-text-field>
                        </v-col>
                        <v-col cols="1">
                            <v-icon :key="`icon-${isEditing}`" :color="isEditing ? 'success' : 'info'" :icon="'mdi-magnify'"
                                size="x-large" @click="SearchProduct()"></v-icon>
                        </v-col>
                        <v-col>
                            <!-- 暫時false -->
                            <v-btn v-show="false" append-icon="$vuetify" variant="tonal" @click="advToggle = !advToggle">
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
                        <v-col cols="2">
                            <v-card>
                                <!-- <v-card-title>
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
                                </v-form> -->
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-row>
                                <v-col cols="3">
                                    <v-row>
                                        <div :class="['text-h5', 'pa-2']">共有<strong class="text-red-lighten-1">{{
                                            productitems.length }}</strong>個搜尋結果
                                        </div>
                                    </v-row>
                                </v-col>
                                <v-col cols="3" :offset="6">
                                    <v-row>
                                        <div :class="['text-h6', 'pa-2']">排序方式:</div>
                                        <v-btn-toggle v-model="selectFilterMode" variant="text" color="blue-darken-4">
                                            <v-btn value="createdate">
                                                時間
                                            </v-btn>
                                            <v-btn value="price">
                                                價錢
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-row>
                                </v-col>
                                <v-row>
                                    <v-col cols="3" v-for="product in productitems" :key="product.title">
                                        <v-card height="100%">
                                            <v-img :src="product.titlepic" class="align-end"
                                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover
                                                @click="Direct(product)">
                                            </v-img>
                                            <v-card-text>
                                                <div>{{ product.title }}</div>
                                                <div v-show="product.newprice" class="text-decoration-line-through">NT${{
                                                    product.price }}</div>
                                                <div v-show="!product.newprice">NT${{ product.price }}</div>
                                                <div style="color: red;" v-show="product.newprice != 0">NT${{
                                                    product.newprice
                                                }}</div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn v-if="product.isFavorite" size="small" color="surface-variant"
                                                    variant="text" @click="DeleteFavorite(product)">
                                                    <v-icon style="color: red;">
                                                        mdi-heart
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn v-if="!product.isFavorite" size="small" color="surface-variant"
                                                    variant="text" @click="AddFavorite(product.id)">
                                                    <v-icon>
                                                        mdi-heart
                                                    </v-icon>
                                                </v-btn>
                                                <!-- <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart"
                                                    @click="AddFavorite(product.id)"></v-btn> -->

                                                <v-btn size="small" color="surface-variant" variant="text"
                                                    icon="mdi-cart-outline" @click="AddOneToCart(product)"></v-btn>
<!-- 
                                                <v-btn size="small" color="surface-variant" variant="text"
                                                    icon="mdi-share-variant"></v-btn> -->
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

    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { type Product, type ResponseData } from '~/Interface/SearchInterface'
import { type Favorite } from '~/Interface/FavoriteInterface'
import { type ApiError } from '~/Interface/FetchInfoInterface'
import Login from '~/pages/user/login.vue'
import Register from '~/pages/user/register.vue'
import { loginServiceStore } from '@/stores/loginService'
const loginService = loginServiceStore()
onMounted(async () => {
    keywordSearch.value = ""
    await loginService.GetUserName()
    await FetchData()
});
const LoginOrRegister = ref(true)
const runtimeCon = useRuntimeConfig()
const IsLogin = ref(false)
const showLoginMessage = ref(false)
const IsNotLogin = ref(false)
const LoginFailMessage = ref("")
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
const selectFilterMode = ref("createDate")
const numberArray = ref(Array.from({ length: 100 }, (num, i) => i + 1))
const availableFile = ref([{ label: "MS-Word文件檔" }, { label: "MS-Excel文件檔" }, { label: "MS-Power Point文件檔" }, { label: "OpenDocument文件檔（含ODT、ODP、ODS）" },
{ label: "HTML網頁檔" }, { label: "PDF列印檔（Portable Document Format）" }, { label: "ZIP壓縮檔" }, { label: "不限" }])
const checkIndexPool: { [key: string]: boolean } = {};
const checkFileTypePool: { [key: string]: boolean } = {};
const cookieValue = ref("")
const AddCartMessage = ref("")
const AddNewToCart = ref(false)
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

watch(selectFilterMode, (newvalue, oldvalue) => {
    SearchProduct()
})
const FetchData = async () => {
    try {
        var temp = loginService.cookieValue
        productitems.value = await $fetch<Product[]>(`${runtimeCon.public.hostDev}/v1/products/`,
            {
                headers: {

                    'userToken': loginService.cookieValue
                }
            }

        )
        var userFavorite = await $fetch<Favorite[]>(`${runtimeCon.public.hostDev}/v1/favorite/${loginService.loginId}`,
            {
                headers: {

                    'userToken': loginService.cookieValue
                }
            }
        )
        userFavorite.forEach(element => {
            productitems.value.forEach(product => {
                if (product.id == element.favoriteproductid) {
                    product.isFavorite = true
                }
            })
        });
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
function Direct(item: Product) {
    console.log(item)
    router.push("/product/" + item.id)
}
async function SearchProduct() {
    try {
        let formData = new FormData();
        formData.append('title', (keywordSearch.value).toString());
        formData.append('filter', (selectFilterMode.value).toString());
        productitems.value = await $fetch<Product[]>(`${runtimeCon.public.hostDev}/v1/products/search`,
            {
                headers: {

                    'userToken': loginService.cookieValue
                },
                method: 'POST',
                body: formData
            });
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
//新增喜愛
async function AddFavorite(productId: number) {
    let formData = new FormData();
    //product
    formData.append('userid', (loginService.loginId).toString());
    formData.append('addproductid', (productId).toString());

    const { error, data } = await useFetch(`${runtimeCon.public.hostDev}/v1/favorite/`, {
        headers: {
            'userToken': loginService.cookieValue,
        },
        method: 'POST',
        body: formData
    })
    if (error.value != null && error.value.statusCode == 401) {
        LoginFailMessage.value = "請先登入帳號"
        IsNotLogin.value = true
        // loginService.LogOut()
    }
    if (error.value == null) {
        const product = productitems.value.find(item => item.id === productId)
        if (product) {
            product.isFavorite = true
        }
    }
}
//去除喜愛
async function DeleteFavorite(product: Product) {
    let formData = new FormData();
    //product
    formData.append('userid', (loginService.loginId).toString());
    formData.append('favoid', (product.id).toString());

    const { error, data } = await useFetch(`${runtimeCon.public.hostDev}/v1/favorite/delete`, {
        headers: {
            'userToken': loginService.cookieValue,
        },
        method: 'POST',
        body: formData
    })
    if (data.value == "success") {
        product.isFavorite = !product.isFavorite
    }
}

//新增一筆至購物車
async function AddOneToCart(product: Product) {
    try {
        let formData = new FormData();
        //加一筆商品至購物車
        formData.append('userid', (loginService.loginId).toString());
        formData.append('productid', (product.id).toString());
        formData.append('numberbuy', (1).toString());
        var result = await $fetch(`${runtimeCon.public.hostDev}/v1/carts/`,
            {
                headers: {
                    'userToken': loginService.cookieValue
                },
                method: 'post',
                body: formData
            });
        if (result == "Success") {
            AddNewToCart.value = true
            AddCartMessage.value = "新增一筆至購物車"
        }
    } catch (error: unknown) {
        if ((error as ApiError).status == 401) {
            LoginFailMessage.value = "請先登入帳號"
            IsNotLogin.value = true
            console.error('An error occurred:', error);
        }
    }

}
</script>