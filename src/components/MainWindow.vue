<template>
  <main class='main-window'>
    <div class='main-window__left' :style='{flex: leftFraction}'>
      <input class='search-input' type="text" :placeholder="placeholderText"
      v-model="searchText">
      <CategoryWindow :category-tree="categoryTree" @change-category="onChangeCategory"/>
    </div>
    <div class="main-window__separator">

    </div>
    <div class="main-window__right" :style='{flex: rightFraction}'>
      <FilterField/>
      <ResearchWindow :research-list="mainCategoryResearches"/>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import CategoryWindow from './CategoryWindow.vue';
import FilterField from './FilterField.vue';
import ResearchWindow from './ResearchWindow.vue';

export default {
  name: 'MainWindow',
  data(){
    return {
      api: axios.create({
        baseURL: "http://45.144.31.110:3000/"
      }),
      placeholderText: "Поиск по всему",
      searchText: "",
      leftFraction: 3,
      rightFraction: 7,
      //Рекурсивный объект, в котором хранятся категории
      categoryTree: [],
      currentMainCategoryId: null,
      currentCategoryId: null,
      existCurrentCategoryId: false,
      //Список: категория и её исследования
      mainCategoryResearches: [],
      //Фильтры для сущностей в виде url параметров (NA и др.)
      allUrlParams: {
        category: [
          'order=name_clr.asc'
        ],
        research: [
          'order=name_lr.asc'
        ],
        oprions: []
      }    
    };
  },
  computed: {
    categoryUrlParams(){
      return '&' +this.allUrlParams['category'].join('&');
    },
    researchUrlParams(){
      return '&' +this.allUrlParams['research'].join('&');
    },
  },
  methods: {
    //Возвращает [{category: category, children: []}]
    //Последние два параметра для побочного эффекта
    makeCategoryTree(categories, parentId, checkedCategoryId = null, mainCategoryId =0){
      let tree = [];

      const children = categories.filter((element)=>element['id_parent'] == parentId);

      for(let element of children){
        //Побочный эффект при создании дерева: проверка что категория есть
        if (checkedCategoryId && (element['id_clr'] == checkedCategoryId)){
          this.existCurrentCategoryId = true;
          this.currentMainCategoryId = mainCategoryId || element['id_clr'];
        }

        tree.push({
          category: element,
          children: this.makeCategoryTree(
            categories, 
            element['id_clr'],
            checkedCategoryId, 
            mainCategoryId ? mainCategoryId : element['id_clr'] //Передача главной категории
          )
        });
      }

      return tree;
    },
    async refreshCategory(checkedCategoryId = null){
      try {
        const table = 'category_lr?'

        //Получение категорий
        const categoryResponse = await this.api.get(table+this.categoryUrlParams);

        const categories = categoryResponse.data;

        this.categoryTree = this.makeCategoryTree(categories, 0, checkedCategoryId);

      } catch(e) {
        console.log('Category fetch error');
        console.log(e);
      }    
    },
    async makeResearches(currentNode, researches=[]){
      //Получение исследований категории
      let researchResponse = await 
        this.api.get('lab_research?id_clr=eq.'+currentNode.category['id_clr']+this.researchUrlParams+
          '&select=id_lr,name_lr, laboratorys_options(id_lo,old_code_l,laboratories(name_lab))'
        );

      const categoryResearches = researchResponse.data;

      researches.push({category: currentNode.category, researches: categoryResearches});
  
      for(let category of currentNode.children){
        this.makeResearches(category, researches);
      }

      return researches;
    },
    async refreshResearches(){
      this.mainCategoryTree = 
        this.categoryTree.find(el=>el.category['id_clr'] == this.currentMainCategoryId);
        
      this.mainCategoryResearches = await this.makeResearches(this.mainCategoryTree);
    },
    async onChangeCategory(categoryId){  
      //Обновляем категории и проверям, что выбранная категория существует
      this.existCurrentCategoryId = false;

      await this.refreshCategory(categoryId);
      
      this.refreshResearches();
    }
  },
  components: {
    CategoryWindow,
    FilterField,
    ResearchWindow,
  },
  created(){
    this.refreshCategory();
  }
}
</script>

<style scoped>
.main-window__left {
  border: 2px solid black;
  overflow: auto;
}

.main-window__right {
  border: 2px solid black;
  overflow: auto;
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
