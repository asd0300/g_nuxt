<template>
    <div>
        <v-card class="position-absolute d-flex align-center justify-center w-100 h-100">
            <v-sheet width="300" class="mx-auto">
                <v-form @submit.prevent>
                    <v-div>註冊</v-div>
                    <v-text-field v-model="email" name="email" label="email" :rules="[rules.required, rules.counter, rules.email]"></v-text-field>
                    <v-text-field v-model="password" name="password" label="password" :type="show1 ? 'text' : 'password'"
                        hint="At least 8 characters"></v-text-field>
                    <v-btn type="submit" block class="mt-2" @click="Create">Submit</v-btn>
                </v-form>
                <!-- <v-btn  block class="mt-2" @click="navigateToHome">前往首頁</v-btn> -->
            </v-sheet>
        </v-card>
        <v-alert v-model="IsFalseCreate" :text="FalseMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsSuccessCreate" text="註冊成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert>
    </div>
</template>
<script setup>
import {encrypt} from '@/Interface/UserInterface'
const FalseMessage = ref("")
const IsSuccessCreate = ref(false)
const IsFalseCreate = ref(false)
const password = ref("")
const email = ref("")
const config = useRuntimeConfig()
const rules = {
    required: value => !!value || 'Required.',
    counter: value => value.length <= 20 || 'Max 20 characters',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
};
async function Create() {
    var encrypass = encrypt(password.value)
    const { data: responseData, error: err } = await useFetch(`${config.public.hostDev}/v1/user/register`, {
        method: 'post',
        body: {
            email: email,
            password: encrypass
        }
    })
    if(err.value!= null){
        IsFalseCreate.value = true
        if(err.value.data.includes("duplicate key value")){
            FalseMessage.value = "註冊失敗" + " 已存在相同帳號"
        }
        else{
            FalseMessage.value = "註冊失敗" + err.value.data
        }
        
    }
    if(responseData.value!=null){
        IsSuccessCreate.value = true
    }
}
const router = useRouter();
const navigateToHome = () =>{
    router.push('/')
}
</script>
