<template>
  <p>Favorite Item</p>
  <span>{{ id }}</span>
</template>
<script setup>
const route = useRoute()
const router = useRouter();
const { id } = route.params
const checkIdAndRedirect = () => {
  const id = route.params.id;
  if (!/^\d+$/.test(id)) { // 使用正則表達式檢查id是否為數字
    router.push('/404'); // 如果不是數字，重定向到404頁面
  }
};





onMounted(async () => {
  checkIdAndRedirect()
});
</script>