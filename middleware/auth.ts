export default defineNuxtRouteMiddleware((to, from) => {
  const sessionToken = useCookie('userToken')
  const isLoggedIn = ref(false); // 判斷是否登入

//   const hasPermission = false; // 判斷有無頁面權限
  if (sessionToken.value !== undefined) {
    isLoggedIn.value = true
  }
  if (isLoggedIn.value == false) {
      return navigateTo('/user/login');
  }

//   if (!hasPermission) {
//       return abortNavigation({
//           statusCode: 403,
//           statusMessage: '無頁面權限'
//       });
//   }
});
