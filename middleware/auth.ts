export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = true; // 判斷是否登入
  const hasPermission = false; // 判斷有無頁面權限

  if (!isLoggedIn) {
      return navigateTo('/login');
  }

  if (!hasPermission) {
      return abortNavigation({
          statusCode: 403,
          statusMessage: '無頁面權限'
      });
  }
});


// import { Context } from '@nuxt/types';
// import {jwtDecode }from 'jwt-decode'; // 使用 jwt-decode 解码 JWT token
// import { useCookie } from 'nuxt/app';

// export default function ({ app, redirect }: Context) {
//   const jwtToken = useCookie("token")
  
//   // 检查 JWT token 是否存在且有效
//   if (!jwtTokenIsValid(jwtToken.value)) {
//     // 如果无效，则重定向到登录页面或其他需要认证的页面
//     return redirect('/login');
//   }
// }

// function jwtTokenIsValid(token:string | null | undefined): boolean {
//     if (!token) {
//       return false;
//     }
//     try {
//         const decodedToken = jwtDecode(token);
//         console.log("確認jwt")
//     return true;
//     } catch (error) {
//     return false;
//     }
// }

