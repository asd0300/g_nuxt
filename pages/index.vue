<template>
    <div>
        <v-card>
            <v-card-title class="text-h5 font-weight-regular bg-blue-grey">
                <v-row>
                    <v-col>
                        Profile
                    </v-col>
                    <v-col :offset="6">
                        <div class="d-flex justify-center">
                            <v-btn>
                                登入
                                <v-overlay activator="parent" location-strategy="connected" scroll-strategy="none"
                                    class="align-center justify-center">
                                    <v-card class="pa-2">
                                        <v-sheet width="300" class="mx-auto">
                                            <v-form @submit.prevent>
                                                <v-text-field v-model="username" label="username"></v-text-field>
                                                <v-text-field v-model="password" label="password"></v-text-field>
                                                <v-btn type="submit" block class="mt-2" @click="login">Submit</v-btn>
                                            </v-form>
                                        </v-sheet>
                                    </v-card>
                                </v-overlay>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="3" :offset="3" md="4">
                            <v-text-field v-model="keywordSearch" label="input search words">

                            </v-text-field>
                        </v-col>
                        <v-col cols="1">
                            <v-icon :key="`icon-${isEditing}`" :color="isEditing ? 'success' : 'info'" :icon="'mdi-magnify'"
                                size="x-large" @click="Test()"></v-icon>
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
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
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
    },
    {
        "indexName": "BookComTw2",
        "searchNum": 163
    },
    {
        "indexName": "BookComTw2",
        "searchNum": 163
    },
    {
        "indexName": "BookComTw2",
        "searchNum": 163
    }]
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

//pagination
const itemsOnPage = ref(1)

//alert
const IsEmptyAlert = ref(false)
const alertMessage = ref("")

async function Test() {
    await useFetch('http://localhost:15693/api/Search')
}

async function GufonetSearch1(isNewQuery: boolean) {
    let idSecondSearch = searchStep.value === 2;
    if (isNewQuery) {
        itemsOnPage.value = 1;
    }
    let query = keywordSearch.value
    if (query === "") {
        IsEmptyAlert.value = true
        alertMessage.value = "查詢句不可為空"
        return
    }
    advSearchToggle(false)  //關閉
    let tempobj;
    let json;
    if (isNewQuery === true) {
        if (idSecondSearch === false) {
            secondSearch.value = ""
        }
        tempobj = await buildQueryJson();
        // tempobj.QueryOption['AddHotKeyword'] = '1';
        // json = JSON.stringify(tempobj)
    }
    // else{
    //     setPagingToSavedRequest();
    //     json = JSON.stringify(savedRequest.value);
    // }
}
// function setPagingToSavedRequest(){
//     let pageSize = ruleForm.count
//     savedRequest.value.Result
// }
function hasPermission(functionID: number) {
    var p = permissions[functionID];
    return p
}

async function buildQueryJson() {
    let querySentence = [];
    const queryOption: { [key: string]: any } = {}
    if (hasPermission(10)) {
        queryOption['StaticsField'] = '$Index$;$FileType$';
    }

    let resultOption = {
        'NeedTotalDocNo': '1',
        'Abstract': '1',
        'ContentField': '$Index$,$Source$,$Name$,$Title$,$Date$,$FileType$'
    };
    //查詢詞
    let query = keywordSearch.value.trim()

    //排序方式
    let sortField = selectFilterMode.value
    if (sortField === "時間") {
        queryOption['SortField'] = "$Date$:+";
    }
    else {
        queryOption['SortField'] = "$TF$:+";
    }
    //檢索模式
    let searchMode = ruleForm.searchMode;
    //時間(rangecondition)
    let rangeCond = '';
    let dateRange = ruleForm.searchRange;
    if (dateRange && dateRange !== "all") {
        let cutDay = new Date();
        if (dateRange === "M1") {
            cutDay.setDate(cutDay.getDate() - 30)
        }
        else if (dateRange === "HY") {
            cutDay.setDate(cutDay.getDate() - 180)
        }
        else {
            cutDay.setDate(cutDay.getDate() - 365)
        }

        if (dateRange !== "A1Y")
            rangeCond = `($Date$ >= '${cutDay.toLocaleDateString()}')`;
        else
            rangeCond = `($Date$ < '${cutDay.toLocaleDateString()}')`;
    }
    //每頁比數
    let pageSize = ruleForm.count
    itemsOnPage.value = pageSize
    //檔案格式限制
    // checkFileTypePool.value = {};
    // ruleForm.type.forEach((a) => {
    //     let curType = a;
    //     if (curType !== 'all') {
    //         checkFileTypePool[curType] = true;
    //     }
    // })
    //篩選檢索(二次檢索)
    let isSeconSearch = (searchStep.value === 2);
    if (isSeconSearch) {
        let secondQuery = secondSearch.value;
        if (secondQuery !== "") {
            query = `${query} and ${secondQuery}`;
        }

        // // //加上索引限制
        // sourceCheckList.value.forEach((item) => {
        //     let indexName = item.label
        //     let check = item.value
        //     checkIndexPool[indexName] = check;
        // })
        // //加上檔案類型限制
        // typeCheckList.value.forEach((item) => {
        //     let curType = item.label;
        //     let check = item.value;
        //     checkFileTypePool[curType] = check;
        // })
    }
    // for(let index in checkIndexPool.value){
    //     let value = checkIndexPool[index]
    //     if(value){
    //         querySentence.push('^' + index)
    //     }
    // }
    // let fileTypeArray = [];
    // for(let fileType in checkFileTypePool.value){

    // }
}
async function login(){
    await useFetch('http://localhost:4000/user/login', {
        method:'post',
        body:{
            name : username,
            password : password
        }
    })
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