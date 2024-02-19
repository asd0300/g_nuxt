import {defineStore} from 'pinia'
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'
export const loginServiceStore = defineStore('token', {
    state: () => ({ cookieValue: "", 
        loginUserName: "",
        IsLogin: false,
        loginId:0 }),
    actions: {
        GetUserName(){
            this.cookieValue = Cookies.get('userToken')
            if (this.cookieValue) {
                console.log(this.cookieValue)
                let decode = jwtDecode(this.cookieValue)
                console.log("解析后的token：", decode.username)
                let exp = decode.exp
                const expirationDate = new Date(exp * 1000);
                const currentDate = new Date();
                if (expirationDate > currentDate) {
                    this.IsLogin = true
                    var cookie = jwtDecode(this.cookieValue).username
                    this.loginUserName = cookie.split(",")[1]
                    this.loginId = cookie.split(",")[0]
                } else {
                    this.IsLogin = false
                    // this.LogOut()
                }
                
            }
            else {
                console.log("Can't find token")
                this.IsLogin = false
            }
        },
        ShowCartStatus(){
            console.log("check cart")
        },
        LogOut() {
            //刪除cookie
            Cookies.remove('userToken'); // 删除名为 'name' 的 cookie
            this.GetUserName()
            window.location.reload();
        }
    },
    getters:{
        doubleCount: (state) => state.count *2
    }
})