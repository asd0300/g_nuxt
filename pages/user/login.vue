<template>
    <div>
        <v-card class="position-absolute d-flex align-center justify-center w-100 h-100">
            <v-sheet width="300" class="mx-auto">
                <v-form @submit.prevent>
                    <v-div>登入</v-div>
                    <v-text-field v-model="email" label="email" :rules="[rules.required, rules.counter, rules.email]"></v-text-field>
                    <v-text-field v-model="password" label="password" :type="show1 ? 'text' : 'password'"
                        hint="At least 8 characters"></v-text-field>
                    <v-btn type="submit" block class="mt-2" @click="Login">Submit</v-btn>
                </v-form>
                <!-- <v-btn  block class="mt-2" @click="navigateToHome">前往首頁</v-btn> -->
            </v-sheet>
        </v-card>
        <v-alert v-model="IsFalseCreate" :text="FalseMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsSuccessCreate" text="登入成功" type="success" variant="tonal" closable
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
const userToken = useCookie('userToken',{maxAge:60 * 60 * 24 * 7})
const rules = {
    required: value => !!value || 'Required.',
    counter: value => value.length <= 20 || 'Max 20 characters',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
};
async function Login() {
    var encryPass = encrypt(password.value)
    const { data: responseData, error: err } = await useFetch(`${config.public.hostDev}/v1/user/login`, {
        method: 'post',
        body: {
            email: email,
            password: encryPass
        }
    })
    if(err.value!= null){
        IsFalseCreate.value = true
        FalseMessage.value = "登入失敗" + err.value.data.error
    }
    if(responseData.value!=null){
        IsSuccessCreate.value = true
        userToken.value = responseData.value.jwt
        ReloadWindow()
    }
}
const router = useRouter();
const navigateToHome = () =>{
    router.push('/')
}
const ReloadWindow= ()=>{
    window.location.reload();
}

// function encrypt (data) {
//   var KEY="qazxswedcvfrtgbn"
//   var IV="qazxswedcvfrtgbn"
//   const key = enc.Utf8.parse(KEY)// 自訂 key
//   const iv = enc.Utf8.parse(IV)// 自訂 iv
//   const encrypted = AES.encrypt(data, key, { iv })
//   return encrypted.toString()
// }
</script>
