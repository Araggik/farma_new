<template>
   <div>   
      <table class="research-table">
         <thead>
            <tr>
               <td v-for="laboratory in laboratoriesList" :key="laboratory['id_labs']">
                  {{ laboratory['name_lab'] }}
               </td>
               <td>Исследования</td>
            </tr>
         </thead>
         <tbody>
            <template v-for="node in researchList" :key="node.category['id_clr']">
               <tr align="center" class="category-header" 
               :class="{'category-header-main': node.category['id_parent'] == 0}">
                  <td :colspan="laboratoriesList.length+1">
                     {{ node.category['name_clr'] }}
                  </td>
               </tr>
               <template v-for="research in node.researches" :key="research['id_lr']">
                  <!--При запросе появляются исследования с пустыми опциями-->
                  <tr v-if="!(research['laboratorys_options'].length == 0 && 
                  maxLaboratories != laboratoriesList.length)">

                     <td v-for="laboratory in laboratoriesList" :key="laboratory['id_labs']">
                        {{ findCodeByLab(research, laboratory) }}
                     </td>
                     <td>
                        {{ research['name_lr'] }}
                     </td>

                  </tr>

               </template>      
            </template>  
         </tbody>
      </table>
   </div> 
</template>

<script>
export default {
   props: {
      researchList: Array,
      laboratoriesList: Array,
      maxLaboratories: Number
   },
   methods: {
      findCodeByLab(research, lab){
         const labOption = research['laboratorys_options'].find((el)=>el['id_labs'] == lab['id_labs']);

         return labOption ? labOption['code_l'] : '-';
      }
   },
}
</script>

<style scoped>
table, tr, td {
   border-collapse: collapse;
   border: 1px solid black;
}
.category-header {
   font-weight: bold;
}

.category-header-main {
   background-color: lightgrey;
}
</style>