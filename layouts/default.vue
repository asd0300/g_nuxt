<template>
    <div>
        <v-card-title class="text-h5 font-weight-regular bg-blue-grey">
            <v-row style="background-color: pink;">
                <v-col>
                    <v-btn variant="plain" to="/">PoYa</v-btn>
                </v-col>
                <v-col :offset="6">
                    <div>
                        <v-div v-show="!loginService.IsLogin">
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
                        <v-container fluid style="height: 20px" v-show="loginService.IsLogin">
                            <v-row justify="center">
                                <v-menu min-width="200px" rounded>
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon v-bind="props">
                                            <v-avatar color="brown" size="large">
                                                <span class="text-h5">{{ loginService.loginUserName }}</span>
                                            </v-avatar>
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-text>
                                            <div class="mx-auto text-center">
                                                <v-avatar color="brown">
                                                    <span class="text-h5">JD</span>
                                                </v-avatar>
                                                <h3>{{ loginService.loginUserName }}</h3>
                                                <p class="text-caption mt-1">
                                                    {{ loginService.loginUserName }}
                                                </p>
                                                <v-divider class="my-3"></v-divider>
                                                <v-btn rounded variant="text">
                                                    Edit Account
                                                </v-btn>
                                                <v-divider class="my-3"></v-divider>
                                                <v-btn rounded variant="text" @click="LogOut()">
                                                    Disconnect
                                                </v-btn>
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </v-menu>
                            </v-row>
                        </v-container>
                        <v-badge :content="1">
                            <v-icon :icon="'mdi-cart-outline'" size="small" @click="ShowCartStatus()"></v-icon>
                        </v-badge>
                    </div>
                </v-col>
            </v-row>
        </v-card-title>
        <slot></slot>
    </div>
</template>
<script setup>
import { loginServiceStore } from '@/stores/loginService'
import Login from '~/pages/user/login.vue'
import Register from '~/pages/user/register.vue'
const loginService = loginServiceStore()
const LoginOrRegister = ref(true)
const fab = ref(true)
onMounted(async () => {
    loginService.GetUserName()
});

function LogOut() {
    const authCookie = useCookie('userToken')
    authCookie.value = null
    loginService.GetUserName()
    window.location.reload();
}
const navigateToHome = () =>{
    if($route == '/'){
        window.location.reload();
    }
    router.push('/')
}
</script>