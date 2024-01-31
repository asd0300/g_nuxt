import {defineStore} from 'pinia'
export const productStore = defineStore('product', {
    state: () => ({ 
        pic: '' as string | ArrayBuffer | null,
        price: 0
    }),
    actions: {
        GetUserName(){

        },
        ShowCartStatus(){
            console.log("check cart")
        },
    },
    getters:{
        
    }
})