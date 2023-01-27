<template>
   <div class="research-window">   
      <table class="research-table" :style="{'width': (laboratoriesList.length*5 + 34)+'em'}">
         <thead class="research-table__head">
            <tr>
               <td class="research-table__lab-td"></td>

               <td v-for="laboratory in laboratoriesList" :key="laboratory['id_labs']+'lab'"
               class="research-table__lab-td">
                  {{ laboratory['name_lab'] }}
               </td>

               <td class="research-table__research-td table-head-btn">
                  <div>Исследования</div>
                  <button @click="$emit('addClick')">Добавить</button>
               </td>
            </tr>
         </thead>
         <tbody>
            <template v-for="(node, nodeIndex) in researchList" :key="node.category['id_clr']">
               <tr class="category-header" 
               :class="{'category-header-main': node.category['id_parent'] == 0 && !isSearchMode,
                  'category-header_blue': node['isCurrentCategory']}"
               :ref="node['isCurrentCategory'] ? 'currentCategory': null">
                  <td :colspan="laboratoriesList.length+1">
                     {{ node.category['name_clr'] }}
                  </td>
               </tr>
               <template v-for="(research, researchIndex) in node.researches" 
               :key="research['id_lr']">
                  <!--При запросе появляются исследования с пустыми опциями-->
                  <tr v-if="!(research['laboratorys_options'].length == 0 && 
                  maxLaboratories != laboratoriesList.length)" class="research-row"
                  :class="{'research-row_italic': research['na']}">
                  
                     <td @mousedown="onSelectMouseDown(research)"
                     @mouseup="onSelectMouseUp"
                     @mouseenter="onSelectMouseEnter(research)">
                        <div class="research-table__select-td">
                           <input v-model="research['isSelected']" type="checkbox">
                        </div>              
                     </td>

                     <td v-for="laboratory in laboratoriesList" :key="laboratory['id_labs']"
                     class="research-table__lab-td"
                     :class="{'research-table__lab-td_green':laboratory['id_labs'] 
                        == research['current_laboratory'] }"
                     @click="onResearchLabClick({
                        'nodeIndex': nodeIndex,
                        'researchIndex': researchIndex,
                        'research': research,
                        'labId': laboratory['id_labs']
                        })"
                     :title="getCodeTitle(research, laboratory)">
                        {{ findCodeByLab(research, laboratory) }}
                     </td>
                     <td class="research-table__research-td"
                     @click="$emit('researchClick', research['id_lr'])"
                     :title="research['name_lr'].length > 70 ? research['name_lr'] : null">
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
       maxLaboratories: Number,
       isSearchMode: Boolean,
       isScroll: Boolean
   },
   emits: ['researchClick', 'addClick', 'changeResearchLab', 'changeSelectResearches'],
   data(){
      return {
         selectResearches: [],
         isSelectMode: false,
         selectModeTimer: null
      }
   },
   methods: {
      onSelectMouseDown(research){
         research['isSelected'] = ! research['isSelected'];

         function changeSelectMode (){
            this.isSelectMode = true;

            console.log(this);
         }

         const func = changeSelectMode.bind(this);

         this.selectModeTimer = setTimeout(func, 300);
      }, 
      onSelectMouseUp(){
         clearTimeout(this.selectModeTimer);

         this.isSelectMode = false;

         console.log('mouseup');
      },
      onSelectMouseEnter(research){
         if (this.isSelectMode)
            research['isSelected'] = ! research['isSelected'];
      },
      getCodeTitle(research, laboratory){
         const code = this.findCodeByLab(research, laboratory);

         if (code.length > 7) 
            return code;
         else 
            return null;   
      },
      findCodeByLab(research, lab) {
          const labOption = research["laboratorys_options"].find((el) => el["id_labs"] == lab["id_labs"]);
          return labOption ? labOption["code_l"] : "-";
      },
      onResearchLabClick(data) {
         this.$emit('changeResearchLab',data);
      }
   },
   updated(){
      if(this.isScroll && this.$refs['currentCategory'] && this.$refs['currentCategory'][0])
         this.$refs['currentCategory'][0]?.scrollIntoView({ behavior: 'smooth' });
   }
}
</script>

<style scoped>
table, tr, td {
   border-collapse: collapse;
   border: 1px solid black;
}

td {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}

/* .research-window{
   padding-top: 34px;
} */

.research-table {
   table-layout: fixed;
}

.research-table__head {
   font-weight: bolder;
}

.research-table__lab-td {
   width: 5em;
   padding: 4px;
}

.research-table__lab-td:hover {
   background-color: lightgray;
}

.research-table__lab-td_green {
   background-color: rgba(109,254,168,255);
}

.research-table__research-td {
   width: 34em;
   padding: 4px;
}

.research-table__research-td:hover {
   background-color: lightgray;
}

.research-table__select-td {
   display: flex;
   justify-content: center;
   width: 5em;
   padding: 4px;
}

.table-head-btn {
   display: flex;
   justify-content: space-between;
   border: none;
}

.category-header {
   font-weight: bold;
   text-align: center;
}

.category-header_blue {
   background-color: rgba(151,224,252,255);
}

.category-header-main {
   background-color: lightgrey;
}

.research-row:hover {
   cursor: pointer;
   font-weight: bolder;
}

.research-row_italic {
   font-style: italic;
}
</style>