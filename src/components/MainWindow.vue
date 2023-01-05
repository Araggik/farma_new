<template>
  <main class='main-window'>
    <div class='main-window__left' :style='{flex: leftFraction}'>
      <input class='search-input main-window__search' type="text" :placeholder="placeholderText"
      v-model.trim="searchText" @input="refreshAll()">
      <CategoryWindow :category-tree="categoryTree" @change-category="onChangeCategory"
      @addClick="onAddCategoryClick" @category-edit="onEditCategory"/>
    </div>
    <div class="main-window__separator">

    </div>
    <div class="main-window__right" :style='{flex: rightFraction}'>
      <FilterField :laboratories='laboratories' @change-laboratories="onChangeLaboratories"
      :search-result-text="searchResultText"/>
      <ResearchWindow :research-list="mainCategoryResearches" :is-search-mode="isSearchMode"
      :laboratories-list="selectLaboratories" :max-laboratories="laboratories.length"
      @research-click="onResearchClick" @addClick="onAddResearchClick"/>
    </div>
  </main>

  <ResearchForm v-if="isResearchFormVisible" :data="currentResearchData"
  @research-form-close="onResearchFormClose" :api="api"/>

  <CategoryForm v-if="isCategoryFormVisible" :data="currentCategoryData" :api="api"
  @category-form-close="onCategoryFormClose"/>
</template>

<script>
import axios from "axios";

import CategoryForm from "./CategoryForm.vue";
import CategoryWindow from './CategoryWindow.vue';
import FilterField from './FilterField.vue';
import ResearchForm from './ResearchForm.vue';
import ResearchWindow from './ResearchWindow.vue';


export default {
  name: 'MainWindow',
  data(){
    return {
      api: axios.create({
        baseURL: "http://45.144.31.110:3000/"
      }),
      placeholderText: "Поиск по всему (От 3 символов)",
      searchText: "",
      searchResultText: "",
      searchResearchesCount: 0,
      leftFraction: 3,
      rightFraction: 7,
      //Рекурсивный объект, в котором хранятся категории
      categoryTree: [],
      currentMainCategoryId: null,
      currentCategoryId: null,
      currentResearchData: null,
      existCurrentCategoryId: false,
      //Список: категория и её исследования
      mainCategoryResearches: [],
      //Список лабораторий
      laboratories: [],
      //Выбранные лаборатории
      selectLaboratories: [],
      isResearchFormVisible: false,
      isCategoryFormVisible: false,
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
      return '&' + this.allUrlParams['options'].join('&');
    },
    isSearchMode(){
      return this.searchText.length > 2;
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
          isCurrentCategory: element['id_clr'] == this.currentCategoryId,
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
          '&select=id_lr,name_lr,current_laboratory, laboratorys_options(id_lo,code_l,id_labs)' +
          this.optionUrlParams
        );

      const categoryResearches = researchResponse.data;

      this.mainCategoryResearches.push({
        category: currentNode.category, 
        researches: categoryResearches,
        isCurrentCategory: currentNode.category['id_clr'] == this.currentCategoryId
      });

      //Подумать над использованием асинхронности
      for(let category of currentNode.children){
        await this.makeResearches(category);
      }
    },
    async refreshResearches(){
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
    onChangeCategory(categoryId){  
      //Обновляем категории и проверям, что выбранная категория существует
      this.existCurrentCategoryId = false;

      this.refreshAll(categoryId);
    },
    async refreshCategoryBySearch(categoryId){
      const categoryResponse = await this.api.get('category_lr?name_clr=like.*'+this.searchText+
        '*&order=name_clr.asc');

      let categoryTree = [];

      for(let category of categoryResponse.data){
          let isCurrent = false;

          if (category['id_clr'] == categoryId) {
            this.existCurrentCategoryId = true;
            this.currentMainCategoryId = categoryId;
            this.currentCategoryId = categoryId;

            isCurrent = true;
          }

          categoryTree.push({
            category: category, 
            children: [], 
            isCurrentCategory: isCurrent
          });
      }

      this.categoryTree = categoryTree;
    },
    async refreshResearchesBySearch(){
        let mainCategoryResearches = [];

        if (this.currentCategoryId) {
          const categoryResponse = await this.api.get('category_lr?id_clr=eq.'+this.currentCategoryId);

          const researchResponse = await this.api.get('lab_research?id_clr=eq.'+
            this.currentCategoryId+'&order=name_lr.asc&select=*,laboratorys_options(*)');

          mainCategoryResearches.push({
            category: categoryResponse.data[0],
            researches: researchResponse.data
          });  

        } else {
          const responses = await Promise.all([
            //По кароткому имени
            this.api.get('category_lr?order=name_clr.asc&select=*,lab_research(*,laboratorys_options(*))&lab_research.name_lr=like.*'+
              this.searchText+'*'),
            //По длинному имени
            this.api.get('category_lr?order=name_clr.asc&select=*,lab_research(*,laboratorys_options(*))&lab_research.full_name_lr=like.*'+
              this.searchText+'*'),
            //По описанию
            this.api.get('category_lr?order=name_clr.asc&select=*,lab_research(*,laboratorys_options(*))&lab_research.desc_lr=like.*'+
              this.searchText+'*'),       
          ]);

          this.searchResearchesCount = 0;

          for(let response of responses){
            for(let category of response.data){
              if (category['lab_research'].length > 0){
                this.searchResearchesCount += category['lab_research'].length;

                const categoryIndex = mainCategoryResearches.findIndex((el)=>
                  el.category['id_clr'] == category['id_clr']);

                if (categoryIndex == -1) {
                  mainCategoryResearches.push({
                    category: category,
                    researches: category['lab_research'],
                  });
                } else {
                  mainCategoryResearches[categoryIndex].researches.push(...category['lab_research']);
                } 
              }
            }
          }
        }

        this.mainCategoryResearches = mainCategoryResearches;
    },
    async refreshAll(categoryId = null){
      this.currentCategoryId = null;

      this.searchResultText = "";

      await this.refreshLaboratories();

      if(this.isSearchMode){        
        await this.refreshCategoryBySearch(categoryId);

        await this.refreshResearchesBySearch();

        this.searchResultText = `Найдено: ${this.categoryTree.length} категорий,
          ${this.searchResearchesCount} исследований`;
      } else {
        await this.refreshCategory(categoryId);

        if(categoryId)  {
          this.refreshResearches();
        } 
      }               
    },
    //Добавляет фильтрацию к laboratorys_options по списку лабораторий
    addLaboratoryOptionsByLabs(labs){
      //Нужно будет в дальнейшем поменять, пока считаем других опций нет
      if (this.allUrlParams['options'].length > 0){
        this.allUrlParams['options'].pop();
      }

      if (labs.length > 0){
        let str='laboratorys_options.id_labs=in.(';

        let n = labs.length-1;

        for(let i=0;i<n;i++){
          str+=labs[i]['id_labs']+',';
        }

        str +=labs[n]['id_labs']+')';

        this.allUrlParams['options'].push(str);
      }

      console.log(this.allUrlParams['options']);
    },
    async onChangeLaboratories(selectLaboratories){
      this.addLaboratoryOptionsByLabs(selectLaboratories);

      await this.refreshAll(this.currentCategoryId);

      if (selectLaboratories.length > 0 )
        this.selectLaboratories = selectLaboratories;
      else
        this.selectLaboratories = this.laboratories;   
    },
    async onResearchClick(researchId){
      //Получение исследования и опций по Id
      const researchResponse = await
        this.api.get(`lab_research?id_lr=eq.${researchId}
          &select=*,laboratorys_options(*,laboratories(name_lab))`);

      if (researchResponse.data.length > 0){
        this.currentResearchData = {'laboratorys_options' : researchResponse.data[0]['laboratorys_options']};

        this.currentResearchData['lab_research'] =  researchResponse.data[0];
        
        delete this.currentResearchData['lab_research']['laboratorys_options'];

        const dataList = ['bm_of_study', 
          'use_m',
          'category_lr', 
        ];
          
        const responses = await Promise.all([
          //Био материалы исследования
          this.api.get(`lab_research?id_lr=eq.${researchId}
            &select=id_lr, bm_of_study(*,bio_materials(name_bm))`),
          //Материалы исследования
          this.api.get(`lab_research?id_lr=eq.${researchId}
            &select=id_lr, use_m(*, materials(name_m))`),
          //Категория исследования
          this.api.get(`lab_research?id_lr=eq.${researchId}
            &select=id_lr, category_lr(id_clr, name_clr)`),       
        ]);  
        
        for(let i=0; i<responses.length; i++) {
          this.currentResearchData[dataList[i]] = responses[i].data[0][dataList[i]];
        }
      }
        
      this.isResearchFormVisible = true;
    },
    async onAddResearchClick(){
      this.currentResearchData = {};

      const dataList = ['bm_of_study', 
          'use_m',
          'laboratorys_options', 
      ];

      for(let element of dataList) {
        this.currentResearchData[element] = [];
      }

      const categoryResponse = await this.api.get('category_lr?limit=1&order=id_clr.asc');

      this.currentResearchData['category_lr'] = categoryResponse.data[0];

      this.currentResearchData['lab_research'] = {
          'id_clr': this.currentResearchData['category_lr']['id_clr'],
          'name_lr': 'Новое исследование',
          'full_name_lr': '',
          'desc_lr': '',
          'for_mens': true,
          'for_womens': true,
          'current_laboratory': 1,
          'na': false
      };

      this.isResearchFormVisible = true;
    },
    async onEditCategory(categoryId){
      const categoryResponse = await this.api.get(`category_lr?id_clr=eq.${categoryId}`);

      this.currentCategoryData = categoryResponse.data[0];

      if (this.currentCategoryData['id_parent'] == 0) 
        this.currentCategoryData['parentName'] = '-';
      else {
        const categoryParentResponse = await this.api.get(`category_lr?id_clr=eq.
          ${this.currentCategoryData['id_parent']}`);

        this.currentCategoryData['parentName'] = categoryParentResponse.data[0]['name_clr'];  
      }  
     
      this.isCategoryFormVisible = true;
    },
    onAddCategoryClick(){
      this.currentCategoryData = {
          'name_clr': 'Новая категория',
          'id_parent': 0,
          'na': false,
          'parentName': '-'
      };

      this.isCategoryFormVisible = true;
    },
    async onResearchFormClose(newData){
      this.isResearchFormVisible = false;

      //Проверка на добавление нового исследования
      const dataResearchIndex = newData.findIndex((el)=>el.table == 'lab_research');

      const isNewResearch = (dataResearchIndex != -1) && 
        !('id_lr' in newData[dataResearchIndex]['updateItems'][0]);

      //Запрос на добавление нового исследования 
      let newResearchId = -1;

      if (isNewResearch) {
        const researchResponse = await this.api.post('lab_research', 
          newData[dataResearchIndex]['updateItems'][0], 
          {
            headers: {
                'Prefer': 'return=representation'
            }
          }
        );

        newResearchId = researchResponse.data[0]['id_lr'];

        newData.splice(dataResearchIndex, 1);
      }

      //Запросы после изменения данных в форме
      for(let element of newData){

        if (isNewResearch) {

          if (element['insertItems'].length > 0){
            //Добавить id_lr если новое исследование
            for (let el of element['insertItems']) {
              el['id_lr'] = newResearchId;
            }

            this.api.post(element['table'], element['insertItems'], {
              headers: {
                'Prefer': 'resolution=merge-duplicates'
              }
            });
          }

        } else {

          if (element['updateItems'].length > 0){

            this.api.post(element['table'], element['updateItems'], {
              headers: {
                'Prefer': 'resolution=merge-duplicates'
              }
            });
          }

          if (element['insertItems'].length > 0){

            this.api.post(element['table'], element['insertItems'], {
              headers: {
                'Prefer': 'resolution=merge-duplicates'
              }
            });
          }

          for(let deleteItem of element['deleteItems']){
            let deleteUrlParams = '';
            for(let key in deleteItem){
              deleteUrlParams += key + '=eq.' + deleteItem[key] + '&';
            }
            this.api.delete(element['table']+'?'+deleteUrlParams);
          }

        }
      }

      this.refreshAll(this.currentCategoryId);
    },
    async onCategoryFormClose(newCategory){
      this.isCategoryFormVisible = false;

      if (newCategory) {
        await this.api.post('category_lr', newCategory, {
          headers: {
            'Prefer': 'resolution=merge-duplicates'
          }
        });
      }

      this.refreshAll(this.currentCategoryId);
    },
  },
  components: {
    CategoryForm,
    CategoryWindow,
    FilterField,
    ResearchWindow,
    ResearchForm
  },
  async created(){
    this.refreshCategory();
    await this.refreshLaboratories();
    this.selectLaboratories = this.laboratories;
  }
}
</script>

<style scoped>
.main-window {
  padding: 2px;
  background-color: lightgray;
}

.main-window__search {
  margin-bottom: 5px;
}

.main-window__left {
  padding: 2px;
  overflow: auto;
}

.main-window__right {
  border: 2px solid black;
  overflow: auto;
  padding: 2px;
  background-color: white;
}

.main-window__separator {
  width: 2px;
}

.main-window {
  z-index: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
}

.search-input {
  width: 100%;
  border: 2px solid black;
}
</style>
