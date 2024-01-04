<template>
    <div>
        <v-card>
            <v-card-title class="text-h5 font-weight-regular bg-blue-grey">
                <v-row>
                    <v-col>
                        Profile
                    </v-col>
                    <v-col :offset="6">
                        <div>
                            <v-dialog width="500">
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" text="登入"> </v-btn>
                                </template>

                                <template v-slot:default="{ isActive }">
                                    <v-card title="登入">
                                        <v-card-text>
                                            <v-form @submit.prevent>
                                                <v-text-field v-model="username" label="username"></v-text-field>
                                                <v-text-field v-model="password" label="password" :type="show1 ? 'text' : 'password'"
                                                    hint="At least 8 characters"></v-text-field>
                                                <v-btn type="submit" block class="mt-2" @click="login">輸入</v-btn>
                                                <v-btn @click="navigateToUserCreate" block class="mt-2">建立帳戶</v-btn>
                                            </v-form>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
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
                            <v-row>
                                <v-col cols="10">
                                    <div>檔案格式限縮:</div>
                                    <v-container fluid>
                                        <v-row>
                                            <v-checkbox v-for="itemFile in availableFile" v-model="selected"
                                                :label="itemFile.label" :value="itemFile.label"
                                                @change="checkFileType(itemFile)"></v-checkbox>
                                        </v-row>
                                    </v-container>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-row>
                </v-form>
                <v-row>
                    <v-col cols="1">
                        <p>熱門查詢詞:</p>

                    </v-col>
                    <v-col>
                        <div class="block no_result text_center" id="no_result" v-show="!IsSearchSuccessResponse">
                            <v-btn v-for="item in 4" class="mx-2">item</v-btn>
                        </div>
                    </v-col>
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
                                                            <v-checkbox v-for="item in test" v-model="typeCheckList"
                                                                :label="item.indexName">
                                                                <template v-slot:label>
                                                                    {{ item.indexName }}
                                                                    <span style="color: red;">({{ item.searchNum }})</span>
                                                                </template>
                                                            </v-checkbox>
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
                                                            <v-checkbox v-for="item in test" v-model="sourceCheckList"
                                                                :label="item.indexName">
                                                                <template v-slot:label>
                                                                    {{ item.indexName }}
                                                                    <span style="color: red;">({{ item.searchNum }})</span>
                                                                </template>
                                                            </v-checkbox>
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
                                    <v-col cols="11">
                                        <v-card style="margin: 10px;" v-for="(item, index) in test">

                                            <div class="d-flex flex-row mb-1">
                                                <p class="ma-2 pa-2" v-if="(index + 1) % 2 !== 0" style="color: orange;">{{
                                                    index + 1 }}</p>
                                                <p class="ma-2 pa-2" v-else style="color: blue;">{{ index + 1 }}</p>
                                                <div class="ma-2 pa-2">
                                                    <div class="ma-2 pa-2">
                                                        [標題] <a href="123" class="ma-2 pa-2">{{ item.indexName }}</a>
                                                    </div>
                                                    <div class="ma-2 pa-2">
                                                        [檔案類型]
                                                    </div>
                                                    <div class="ma-2 pa-2">
                                                        [時間]
                                                    </div>
                                                    <div class="ma-2 pa-2">
                                                        [內容摘要]
                                                    </div>
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
        </v-card>
        <div class="text-center">
            <v-container>
                <v-row justify="center">
                    <v-col cols="8">
                        <v-container class="max-width">
                            <v-pagination v-model="itemsOnPage" class="my-4" :length="itemsOnPage"></v-pagination>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <v-alert v-model="IsEmptyAlert" text="查詢句不可為空" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsNotLogin" :text="LoginFailMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsLogin" text="登入成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { type ResponseData} from '~/Interface/SearchInterface'
const test = [
    {
        "indexName": "BookComTw",
        "searchNum": 162
    },
    {
        "indexName": "BookComTw2",
        "searchNum": 163
    },
    {
        "indexName": "BookComTw2",
        "searchNum": 163
    }]
const runtimeCon = useRuntimeConfig()
const IsLogin = ref(false)
const IsNotLogin = ref(false)
const LoginFailMessage=ref("")
const username = ref("")
const password = ref("")
const secondSearch = ref("")
const keywordSearch = ref('')
const isEditing = ref(false)
const advToggle = ref(false)
const select = ref(1)
const selected = ref<String[]>([])
const typeCheckList = ref<String[]>([])
const sourceCheckList = ref<String[]>([])
const open = ref<String[]>(['Users'])
const IsSearchSuccessResponse = ref(false)
const selectFilterMode = ref("時間")
const numberArray = ref(Array.from({ length: 100 }, (num, i) => i + 1))
const availableFile = ref([{ label: "MS-Word文件檔" }, { label: "MS-Excel文件檔" }, { label: "MS-Power Point文件檔" }, { label: "OpenDocument文件檔（含ODT、ODP、ODS）" },
{ label: "HTML網頁檔" }, { label: "PDF列印檔（Portable Document Format）" }, { label: "ZIP壓縮檔" }, { label: "不限" }])
const searchStep = ref(0)
const permissions: { [key: number]: boolean } = {}
const savedRequest = ref({});
const ruleForm = reactive<RuleForm>({
    searchMode: '0',
    searchRange: "all",
    count: 10,
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})
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
async function login() {
    const { data: responseData, error: err } = await useFetch<ResponseData>(`${runtimeCon.public.hostDev}/user/login`, {
        method: 'post',
        body: {
            name: username,
            password: password
        }
    })
    if (err.value != null) {
        IsNotLogin.value = true
        LoginFailMessage.value = err.value.data.error
        return
    }
    const cookie = useCookie("token")
    // const count = useCookie("counter",{maxAge:60})
    // count.value = Math.round(Math.random()*1000)
    var test = responseData.value?.data.token!
    cookie.value = test.toString()
    IsLogin.value = true
}
const router = useRouter();
const navigateToUserCreate = () =>{
    router.push('/user')
}
//
function checkFileType(itemFile: any) {
    if (itemFile.label === "不限" && selected.value.includes("不限")) {
        selected.value = ["不限"];
    }
    else if (itemFile.label !== "不限") {
        let index = selected.value.indexOf("不限");
        if (index >= 0) {
            selected.value.splice(index, 1)
        }
    }
}
function advSearchToggle(toggle: boolean) {
    advToggle.value = false
}
</script>