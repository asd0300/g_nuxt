import {defineStore} from 'pinia'
export const productServiceStore = defineStore('product', {
    state: () => ({ 
        title: "", 
        productprice: "0",
        productnewprice: "0",
        titlepic:"",
        otherpic:"",
        feature:"",
        content:"",
        spec:"" }),
    actions: {
        
    },
    getters:{
        doubleCount: (state) => state.count *2
    }
})