import cryptoJS from 'crypto-js'
const { enc, AES } = cryptoJS
import { loginServiceStore } from '@/stores/loginService'

export function encrypt (data:string) {
    var KEY="qazxswedcvfrtgbn"
    var IV="qazxswedcvfrtgbn"
    const key = enc.Utf8.parse(KEY)// 自訂 key
    const iv = enc.Utf8.parse(IV)// 自訂 iv
    const encrypted = AES.encrypt(data, key, { iv })
    return encrypted.toString()
  }
export function GetUser(){
    var loginService = loginServiceStore()
    loginService.GetUserName()
}