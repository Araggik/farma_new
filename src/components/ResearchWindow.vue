<template>
   <div class="research-window">   
      <table class="research-table">
         <thead class="research-table__head">
            <tr>
               <td v-for="laboratory in laboratoriesList" :key="laboratory['id_labs']">
                  {{ laboratory['name_lab'] }}
               </td>
               <td>Исследования</td>
            </tr>
         </thead>
         <tbody>
            <template v-for="node in researchList" :key="node.category['id_clr']">
               <tr class="category-header" 
               :class="{'category-header-main': node.category['id_parent'] == 0}">
                  <td :colspan="laboratoriesList.length+1">
                     {{ node.category['name_clr'] }}
                  </td>
               </tr>
               <template v-for="research in node.researches" :key="research['id_lr']">
                  <!--При запросе появляются исследования с пустыми опциями-->
                  <tr v-if="!(research['laboratorys_options'].length == 0 && 
                  maxLaboratories != laboratoriesList.length)" class="research-row">

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
   <ResearchForm v-if="isFormVisible"/>
</template>

<script>
import ResearchForm from './ResearchForm.vue';

export default {
   props: {
       researchList: Array,
       laboratoriesList: Array,
       maxLaboratories: Number
   },
   data(){
      return {
         isFormVisible: false
      };
   },
   methods: {
       findCodeByLab(research, lab) {
           const labOption = research["laboratorys_options"].find((el) => el["id_labs"] == lab["id_labs"]);
           return labOption ? labOption["code_l"] : "-";
       }
   },
   components: { 
     ResearchForm 
   }
}
</script>

<style scoped>
table, tr, td {
   border-collapse: collapse;
   border: 1px solid black;
}

.research-window{
   padding-top: 34px;
}

/* .research-table__head {
   
} */

.category-header {
   font-weight: bold;
   text-align: center;
}

.category-header-main {
   background-color: lightgrey;
}

.research-row:hover {
   cursor: pointer;
   font-weight: bolder;
}
</style>