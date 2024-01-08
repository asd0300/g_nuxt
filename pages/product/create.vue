<template>
    <div>
        <v-card class="position-absolute d-flex align-center justify-center w-100 h-100">
            <v-sheet width="300" class="mx-auto">
                <v-form @submit.prevent>
                    <v-text-field v-model="titleName" label="Title Name"
                        :rules="[rules.required, rules.counter]"></v-text-field>
                    <v-text-field v-model="price" label="ProductPrice"
                        :rules="[rules.required, rules.counter]"></v-text-field>
                    <v-text-field v-model="newPrice" label="ProductNewPrice"
                    :rules="[rules.counter]"></v-text-field>
                    <v-file-input ref="titleFiles" :rules="[rules.volumn]" accept="image/png, image/jpeg, image/bmp" placeholder="Title pic"
                        prepend-icon="mdi-camera" label="Title picture" @change="previewFiles"></v-file-input>
                    <v-file-input ref="detailFiles" multiple :rules="[rules.volumn]" accept="image/png, image/jpeg, image/bmp"
                        placeholder="detail pic" prepend-icon="mdi-camera" label="detail pictures" @change="previewFilesDetail"></v-file-input>
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
<script setup>
const titleImg = ref("null")
const detailPics = ref("null")
const FalseMessage = ref("")
const IsSuccessCreate = ref(false)
const IsFalseCreate = ref(false)
const price = ref(0)
const newPrice = ref(0)
const picBase64 = ref("")
const picDetailBase64 = ref("")
const titleName = ref("")
const rules = {
    required: value => !!value || 'Required.',
    volumn: value => !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!',
    counter: value => value.length <= 20 || 'Max 20 characters',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
}
const previewFiles = (event)=>{
    titleImg.value = event.target.files[0]
    if(titleImg){
        picBase64.value = getBase64(titleImg)
    }
}

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
const previewFilesDetail = (event)=>{
    detailPics.value = event.target.files
    if(detailPics){
        picDetailBase64.value = getBase64(detailPics)
    }
}
async function Create() {
    console.log("123")
    const { data: responseData, error: err } = await useFetch(`${config.public.hostDev}/v1/products`, {
        method: 'post',
        body: {
            title: titleName,
            price: price,
            newprice: newPrice,
            titlepic: picBase64,
            otherpic: picDetailBase64
        }
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
