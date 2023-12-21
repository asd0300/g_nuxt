<template>
    <div>
        <v-card class="position-absolute d-flex align-center justify-center w-100 h-100">
            <v-sheet width="300" class="mx-auto">
                <v-form @submit.prevent>
                    <v-text-field v-model="username" label="email" :rules="[rules.required, rules.counter, rules.email]"></v-text-field>
                    <v-text-field v-model="password" label="password" :type="show1 ? 'text' : 'password'"
                        hint="At least 8 characters"></v-text-field>
                    <v-btn type="submit" block class="mt-2" @click="Create">Submit</v-btn>
                </v-form>
                <v-btn  block class="mt-2" @click="navigateToHome">前往首頁</v-btn>
            </v-sheet>
        </v-card>
        <!-- <v-fade-transition hide-on-leave>
            <v-card v-if="dialog" append-icon="$close" class="mx-auto" elevation="16" max-width="500"
                title="Send a receipt">
                <template v-slot:append>
                    <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
                </template>

                <v-divider></v-divider>

                <div class="py-12 text-center">
                    <v-icon class="mb-6" color="success" icon="mdi-check-circle-outline" size="128"></v-icon>

                    <div class="text-h4 font-weight-bold">This receipt was sent</div>
                </div>

                <v-divider></v-divider>

                <div class="pa-4 text-end">
                    <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                        @click="dialog = false">
                        Close
                    </v-btn>
                </div>
            </v-card>
        </v-fade-transition> -->
        <v-alert v-model="IsFalseCreate" :text="FalseMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsSuccessCreate" text="註冊成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert>
    </div>
</template>
<script setup>
const FalseMessage = ref("")
const IsSuccessCreate = ref(false)
const IsFalseCreate = ref(false)
const password = ref("")
const username = ref("")
const rules = {
    required: value => !!value || 'Required.',
    counter: value => value.length <= 20 || 'Max 20 characters',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
};
async function Create() {
    const { data: responseData, error: err } = await useFetch('http://localhost:4000/user/create', {
        method: 'post',
        body: {
            name: username,
            password: password
        }
    })
    if(err.value!= null){
        IsFalseCreate.value = true
        FalseMessage.value = "註冊失敗" + err.value.data.error
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
