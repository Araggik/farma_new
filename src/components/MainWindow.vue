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
      <FilterField :laboratories='laboratories' @change-laboratories="onChangeLaboratories"/>
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
      //Список лабораторий
      laboratories: [],
      //Фильтры для сущностей в виде url параметров (NA и др.)
      allUrlParams: {
        category: [
          'order=name_clr.asc'
        ],
        research: [
          'order=name_lr.asc'
        ],
        options: [
        ]
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
    optionUrlParams(){
      return '&' + this.allUrlParams['option'].join('&');
    }
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
          this.currentCategoryId = checkedCategoryId;
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
    async makeResearches(currentNode){
      //Получение исследований категории
      let researchResponse = await 
        this.api.get('lab_research?id_clr=eq.'+currentNode.category['id_clr']+this.researchUrlParams+
          '&select=id_lr,name_lr, laboratorys_options(id_lo,old_code_l,laboratories(name_lab))' +
          this.optionUrlParams
        );

      const categoryResearches = researchResponse.data;

      this.mainCategoryResearches.push({category: currentNode.category, researches: categoryResearches});
  
      for(let category of currentNode.children){
        this.makeResearches(category);
      }
    },
    refreshResearches(){
      const mainCategoryTree = 
        this.categoryTree.find(el=>el.category['id_clr'] == this.currentMainCategoryId);

      this.mainCategoryResearches.length = 0;  
        
      this.makeResearches(mainCategoryTree);
    },
    async refreshLaboratories(){
      const laboratoriesResponse = await 
        this.api.get('laboratories');

      this.laboratories = laboratoriesResponse.data;
    },
    async onChangeCategory(categoryId){  
      //Обновляем категории и проверям, что выбранная категория существует
      this.existCurrentCategoryId = false;

      this.refreshAll(categoryId);
    },
    async refreshAll(categoryId = null){
      await this.refreshCategory(categoryId);

      await this.refreshLaboratories();

      if(categoryId)  {
        this.refreshResearches();
      }           
    },
    //Добавляет фильтрацию к laboratorys_options по списку лабораторий
    addLaboratoryOptionsByLabs(labs){
      //Нужно будет в дальнейшем поменять, пока считаем других опций нет
      if (this.allUrlParams['options'].length > 0){
        this.allUrlParams['options'].pop();
      }

      let str='laboratorys_options.id_labs=in.(';

      let n = labs.length-1;

      for(let i=0;i<n;i++){
        str+=labs[i]['id_labs']+',';
      }

      str +=labs[n]['id_labs']+')';

      this.allUrlParams['options'].push(str);

      console.log(this.allUrlParams['options']);
    },
    onChangeLaboratories(selectLaboratories){
      this.addLaboratoryOptionsByLabs(selectLaboratories);

      this.refreshAll(this.currentCategoryId);
    }
  },
  components: {
    CategoryWindow,
    FilterField,
    ResearchWindow,
  },
  created(){
    this.refreshCategory();
    this.refreshLaboratories();
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
