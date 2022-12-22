<template>
   <!-- Проблема: Props передает только первый элемент -->
   <div>   
      <!-- <div v-for="element of researchList" :key="element.category['id_clr']">
         <p style="font-weight: bold;">
            {{ element.category['name_clr'] }}
         </p>
         <p v-for="research of element.researches" :key="research['id_lr']">
            {{ research['name_lr'] }}
         </p>
      </div> -->
      <table>
         
      </table>
   </div> 
</template>

<script>
export default {
   props: {
      researchList: Array
   }
}
</script>

<style scoped>
</style>