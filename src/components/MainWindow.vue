<template>
  <main class='main-window'>
    <div class='main-window__left' :style='{flex: leftFraction}'>
      <input class='search-input' type="text" :placeholder="placeholderText"
      v-model="searchText">
      <CategoryWindow/>
    </div>
    <div class="main-window__separator">

    </div>
    <div class="main-window__right" :style='{flex: rightFraction}'>
      <FilterField/>
      <ResearchWindow/>
    </div>
  </main>
</template>

<script>
import api from "../api/api.js";
import CategoryWindow from './CategoryWindow.vue';
import FilterField from './FilterField.vue';
import ResearchWindow from './ResearchWindow.vue';

export default {
  name: 'MainWindow',
  data(){
    return {
      placeholderText: "Поиск по всему",
      searchText: "",
      leftFraction: 3,
      rightFraction: 7,
      categoriesAndResearches: [],
      //Фильтры для сущностей в виде url параметров (NA и др.)
      allUrlParams: {
        category: [],
        research: [],
        oprions: []
      }    
    };
  },
  methods: {
    async refreshCategoriesAndResearches(){
      try{
        this.categoriesAndResearches = await this.createHierarchy(0);
        console.log(this.categoriesAndResearches);
      } catch(e){
        console.log(e);
        console.log('Refresh Error');
      }    
    },
    async createHierarchy(parentId){
      let hierarchy = [];
      
      //Получение детей категории
      let categoryResponse = await api.getCategories(
        'id_parent=eq.'+ parentId + this.allUrlParams['category'].join('')
      );

      let categories = categoryResponse.data;

      for(let element of categories){
        let newCategoryNode = {
          category: element
        };

        //Получение исследований категории
        let researchResponse = await api.getResearches(
          'id_clr=eq.'+ element['id_clr'] + this.allUrlParams['research'].join('')
        );

        let researches = researchResponse.data;

        newCategoryNode['researches'] = researches;

        //Получение детей детей
        let categoryChildren = await this.createHierarchy(element['id_clr']);

        newCategoryNode['children'] = categoryChildren;

        hierarchy.push(newCategoryNode);
      }

      return hierarchy;
    }
  },
  components: {
    CategoryWindow,
    FilterField,
    ResearchWindow,
  },
  mounted(){
    this.refreshCategoriesAndResearches();
  }
}
</script>

<style scoped>
.main-window__left {
  border: 2px solid black;
}

.main-window__right {
  border: 2px solid black;
}

.main-window__separator {
  width: 2px;
}

.main-window {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.search-input {
  width: 100%;
}
</style>
