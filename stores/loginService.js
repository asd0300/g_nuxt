import {defineStore} from 'pinia'
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
export const loginServiceStore = defineStore('token', {
    state: () => ({ cookieValue: "", 
        loginUserName: "",
        IsLogin: false }),
    actions: {
        GetUserName(){
            this.cookieValue = Cookies.get('userToken')
            if (this.cookieValue != "") {
                console.log(this.cookieValue)
                console.log("解析后的token：", jwtDecode(this.cookieValue).username)
                this.IsLogin = true
                this.loginUserName = jwtDecode(this.cookieValue).username
            }
            else {
                console.log("Can't find token")
            }
        },
        ShowCartStatus(){
            console.log("check cart")
        },
    },
    getters:{
        doubleCount: (state) => state.count *2
    }
})