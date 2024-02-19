<template>
    <div>
        <v-layout class="rounded rounded-md">
            <v-navigation-drawer>
                <v-card class="mx-auto" max-width="300">
                    <v-list>
                        <template v-for="(item, index) in items" :key="index">
                            <v-subheader v-if="item.type === 'subheader'">
                                {{ item.title }}
                            </v-subheader>
                            <v-divider v-else-if="item.type === 'divider'"></v-divider>
                            <v-list-item v-else @click="item.action">
                                <v-list-item-title v-text="item.title" :type="item.type"></v-list-item-title>

                            </v-list-item>
                        </template>
                    </v-list>
                </v-card>
            </v-navigation-drawer>
            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                <v-row>
                    <v-col cols="3" v-for="product in result" :key="product.title">
                        <v-card height="100%">
                            <v-img :src="product.titlepic" class="align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px" cover
                                @click="Direct(product)">
                            </v-img>
                            <v-card-text>
                                <div>{{ product.title }}</div>
                                <div v-show="product.newprice" class="text-decoration-line-through">NT${{
                                    product.price }}</div>
                                <div v-show="!product.newprice">NT${{ product.price }}</div>
                                <div style="color: red;" v-show="product.newprice != 0">NT${{
                                    product.newprice
                                }}</div>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <!-- <v-btn v-if="product.isFavorite" size="small" color="surface-variant" variant="text"
                                    >
                                    <v-icon style="color: red;">
                                        mdi-heart
                                    </v-icon>
                                </v-btn>
                                <v-btn v-if="!product.isFavorite" size="small" color="surface-variant" variant="text"
                                    >
                                    <v-icon>
                                        mdi-heart
                                    </v-icon>
                                </v-btn> -->
                                <!-- delete favo -->
                                <v-btn size="small" color="surface-variant" variant="text" @click="Delete(product)">
                                    <v-icon>
                                        mdi-delete-circle
                                    </v-icon>
                                </v-btn>
                                <!-- <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart"
                                                    @click="AddFavorite(product.id)"></v-btn> -->

                                <!-- <v-btn size="small" color="surface-variant" variant="text" icon="mdi-cart-outline"
                                    @click=""></v-btn>

                                <v-btn size="small" color="surface-variant" variant="text" icon="mdi-share-variant"></v-btn> -->
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-main>
        </v-layout>
        <v-alert v-model="IsFalseCreate" :text="FalseMessage" type="error" variant="tonal" closable
            close-label="Close Alert"></v-alert>
        <v-alert v-model="IsSuccessCreate" text="註冊成功" type="success" variant="tonal" closable
            close-label="Close Alert"></v-alert>
    </div>
</template>
<script lang="ts" setup>
import { type Product } from '@/Interface/SearchInterface'
import { loginServiceStore } from '@/stores/loginService'
import { type Favorite } from '~/Interface/FavoriteInterface'
const FalseMessage = ref("")
const productitems = ref<Product[]>([])
const IsSuccessCreate = ref(false)
const IsFalseCreate = ref(false)
const password = ref("")
const username = ref("")
const runtimeCon = useRuntimeConfig()
const loginService = loginServiceStore()
const result = ref<Product[]>([])
const FetchData = async () => {
    try {
        var temp = loginService.cookieValue
        productitems.value = await $fetch<Product[]>(`${runtimeCon.public.hostDev}/v1/products/`,
            {
                headers: {

                    'userToken': loginService.cookieValue
                }
            }

        )
        var userFavorite = await $fetch<Favorite[]>(`${runtimeCon.public.hostDev}/v1/favorite/${loginService.loginId}`,
            {
                headers: {

                    'userToken': loginService.cookieValue
                }
            }
        )
        let favoriteIds = userFavorite.map(item => item.favoriteproductid);
        result.value = productitems.value.filter(item => favoriteIds.includes(item.id));
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}
const items = [
    { type: 'subheader', title: 'User function' },
    {
        title: 'Favorite Products',
        value: 1,
        action: FetchData
    },
    {
        title: '',
        value: 2,
    },
    { type: 'divider' },

]
async function Create() {
    const { data: responseData, error: err } = await useFetch('http://localhost:4000/user/create', {
        method: 'post',
        body: {
            name: username,
            password: password
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
function Direct(item: Product) {
    router.push("/product/" + item.id)
}
// 刪除favo
async function Delete(item: Product) {
    let formData = new FormData();
    formData.append('userid', (loginService.loginId).toString());
    formData.append('favoid', (item.id).toString());
    var result = await $fetch(`${runtimeCon.public.hostDev}/v1/favorite/delete`,
        {
            headers: {
                'userToken': loginService.cookieValue
            },
            method: 'POST',
            body: formData
        }
    )
}
const router = useRouter();
onMounted(async () => {
    await loginService.GetUserName()
    await FetchData()
});
</script>
