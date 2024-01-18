<template>
    <div>
        <v-card-title class="text-h5 font-weight-regular bg-blue-grey">
            <v-row style="background-color: pink;">
                <v-col>
                    Profile
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
                        <v-btn v-show="loginService.IsLogin">
                            welcome back, {{ loginService.loginUserName }}
                        </v-btn>
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
import {loginServiceStore} from '@/stores/loginService'
const loginService = loginServiceStore()

onMounted(async () => {
    loginService.GetUserName()
});
</script>