<template>
    <div>
        <v-card>
            <v-card-title>新增商品</v-card-title>
            <v-sheet width="300" class="mx-auto">
                <v-form @submit.prevent>
                    <v-text-field v-model="titleName" label="Title Name"
                        :rules="[rules.required, rules.counter]"></v-text-field>
                    <v-text-field v-model="price" label="ProductPrice"
                        :rules="[rules.required, rules.counter]"></v-text-field>
                    <v-text-field v-model="newPrice" label="ProductNewPrice" :rules="[rules.counter]"></v-text-field>
                    <v-text-field v-model="titlePic" label="Title Picture"></v-text-field>
                    <v-text-field v-model="otherpic" label="Other Pictures"></v-text-field>
                    <v-text-field v-model="option" label="Select option"></v-text-field>
                    <v-text-field v-model="feature" label="feature Content"></v-text-field>
                    <v-text-field v-model="content" label="Content In html"></v-text-field>
                    <v-text-field v-model="spec" label="Spec Table Content"></v-text-field>
                    <!-- <v-file-input ref="titleFiles" :rules="[rules.volumn]" accept="image/png, image/jpeg, image/bmp"
                        placeholder="Title pic" prepend-icon="mdi-camera" label="Titlepicture"
                        @change="previewFiles"></v-file-input>
                    <v-file-input ref="detailFiles" multiple :rules="[rules.volumn]"
                        accept="image/png, image/jpeg, image/bmp" placeholder="detail pic" prepend-icon="mdi-camera"
                        label="detail pictures"></v-file-input> -->
                    <v-btn type="submit" block class="mt-2" @click="Create">Submit</v-btn>
                </v-form>
                <v-btn block class="mt-2" @click="navigateToHome">前往首頁</v-btn>
            </v-sheet>
        </v-card>
        <v-alert v-model="IsFalseCreate" :text="FalseMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsSuccessCreate" text="註冊成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert>
    </div>
</template>
<script setup lang="ts">
import {productServiceStore} from '@/stores/productService'
import { loginServiceStore } from '@/stores/loginService'
const loginService = loginServiceStore()
definePageMeta({
    middleware: ['auth']
})

const productServicetor = productServiceStore()
const titleImg = ref("")
const detailPics = ref("null")
const FalseMessage = ref("")
const IsSuccessCreate = ref(false)
const IsFalseCreate = ref(false)
const price = ref(0)
const newPrice = ref(0)
const picBase64 = ref("")
const picDetailBase64 = ref("")
const titleName = ref("")
const titlePic = ref("")
const otherpic = ref("")
const content = ref("")
const feature = ref("")
const option = ref("")
const spec = ref("")
const file = ref<File | null>(null)
const rules = {
    required: (value: any) => !!value || 'Required.',
    volumn: (value: string | any[]) => !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!',
    counter: (value: string | any[]) => value.length <= 40 || 'Max 40 characters',
    email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
}

// const previewFiles = (event: any) => {
//     let rawImg: string | ArrayBuffer | null
//     // titleImg.value = event.target.files[0]
//     const file = event.target.files[0]

//     const reader = new FileReader();

//     reader.onloadend = () => {
//         rawImg = reader.result;
//         console.log(rawImg);
//         titleImg.value = rawImg as string
//         productServicetor.pic = rawImg
//     }
//     reader.readAsDataURL(file);
    
// }
async function Create() {
    let formData = new FormData();
    //product
    formData.append('title', titleName.value);
    formData.append('price', (price.value).toString());
    formData.append('newprice', (newPrice.value).toString());
    formData.append('titlepic', (titlePic.value).toString());
    formData.append('otherpic', (otherpic.value).toString());
    //detail
    formData.append('option', (option.value).toString());
    formData.append('feature', (feature.value).toString());
    formData.append('content', (content.value).toString());
    formData.append('spec', (spec.value).toString());
    var result  = await $fetch(`${config.public.hostDev}/v1/products/`, {
        headers:{
            'userToken': loginService.cookieValue,
        },
        method: 'POST',
        body: formData
    })
}
const router = useRouter();
const config = useRuntimeConfig()
const navigateToHome = () => {
    router.push('/')
}
</script>
