<template>
    <div>
        <v-card>
            <v-sheet width="300" class="mx-auto">
                <v-form @submit.prevent>
                    <v-text-field v-model="titleName" label="Title Name"
                        :rules="[rules.required, rules.counter]"></v-text-field>
                    <v-text-field v-model="price" label="ProductPrice"
                        :rules="[rules.required, rules.counter]"></v-text-field>
                    <v-text-field v-model="newPrice" label="ProductNewPrice" :rules="[rules.counter]"></v-text-field>
                    <v-file-input ref="titleFiles" :rules="[rules.volumn]" accept="image/png, image/jpeg, image/bmp"
                        placeholder="Title pic" prepend-icon="mdi-camera" label="Titlepicture"
                        @change="previewFiles"></v-file-input>
                    <v-file-input ref="detailFiles" multiple :rules="[rules.volumn]"
                        accept="image/png, image/jpeg, image/bmp" placeholder="detail pic" prepend-icon="mdi-camera"
                        label="detail pictures"></v-file-input>
                    <v-container fluid>
                        <v-textarea clearable clear-icon="mdi-close-circle" label="Content"
                            model-value="Content here"></v-textarea>
                    </v-container>
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
import {productStore} from '@/stores/productService'
definePageMeta({
    middleware: ['auth']
})
const productServicetor = productStore()
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
const file = ref<File | null>(null)
const rules = {
    required: (value: any) => !!value || 'Required.',
    volumn: (value: string | any[]) => !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!',
    counter: (value: string | any[]) => value.length <= 20 || 'Max 20 characters',
    email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
}
const previewFiles = (event: any) => {
    let rawImg: string | ArrayBuffer | null
    // titleImg.value = event.target.files[0]
    const file = event.target.files[0]

    const reader = new FileReader();

    reader.onloadend = () => {
        rawImg = reader.result;
        console.log(rawImg);
        titleImg.value = rawImg as string
        productServicetor.pic = rawImg
    }
    reader.readAsDataURL(file);
    
}
async function Create() {
    let formData = new FormData();
    formData.append('title', titleName.value);
    formData.append('price', (price.value).toString());
    formData.append('newprice', (newPrice.value).toString());
    formData.append('titlePic', (titleImg.value).toString());
    formData.append('detailDescript', (titleImg.value).toString());
    const { data: responseData, error: err } = await useFetch(`${config.public.hostDev}/v1/products/`, {
        method: 'post',
        body: formData
    })
    if (err.value != null) {
        IsFalseCreate.value = true
        FalseMessage.value = "註冊失敗" + err.value.data.error
    }
    if (responseData.value != null) {
        IsSuccessCreate.value = true
    }
}
const router = useRouter();
const config = useRuntimeConfig()
const navigateToHome = () => {
    router.push('/')
}
</script>
