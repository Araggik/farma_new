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
      <ResearchWindow :research-list="mainCategoryResearches" 
      :laboratories-list="selectLaboratories" :max-laboratories="laboratories.length"
      @research-click="onResearchClick" @addClick="onAddResearchClick"/>
    </div>
  </main>
  <ResearchForm v-if="isResearchFormVisible" :data="currentResearchData"
  @form-close="onResearchFormClose" :api="api"/>
</template>

<script>
import axios from "axios";
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
      placeholderText: "Поиск по всему",
      searchText: "",
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
          '&select=id_lr,name_lr, laboratorys_options(id_lo,code_l,id_labs)' +
          this.optionUrlParams
        );

      const categoryResearches = researchResponse.data;

      this.mainCategoryResearches.push({category: currentNode.category, researches: categoryResearches});

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
      this.currentResearchData = null;

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
      this.currentResearchData = null;

      const dataList = ['bm_of_study', 
          'use_m',
          'laboratorys_options', 
      ];

      for(let element in dataList) {
        this.currentResearchData[element] = [];
      }

      const categoryResponse = await this.api.get('category_lr?limit=1&order=id_clr.asc');

      this.currentResearchData['category_lr'] = categoryResponse.data;

      this.currentResearchData['lab_research'] = {
          'id_clr': this.currentResearchData['category_lr']['id_clr'],
          'name_lr': 'Исследование',
          'full_name_lr': '',
          'desc_lr': '',
          'for_mens': true,
          'for_womens': true,
          'current_laboratory': 1,
          'na': false
      };

      this.isResearchFormVisible = true;
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
          newData[dataResearchIndex]['udpateItems'][0], 
          {
            headers: {
                'Prefer': 'return=representation'
            }
          }
        );

        newResearchId = researchResponse.data['id_lr'];

        newData.splice(dataResearchIndex, 1);
      }

      //Запросы после изменения данных в форме
      for(let element of newData){

        if (element['updateItems'].length > 0){

          //Добавить id_lr если новое исследование
          if(isNewResearch){            
            for (let el in element['updateItems']) {
              el['id_lr'] = newResearchId;
            }
          }
          

          this.api.post(element['table'], element['updateItems'], {
            headers: {
              'Prefer': 'resolution=merge-duplicates'
            }
          });
        }

        if (element['insertItems'].length > 0){

          if(isNewResearch){            
            for (let el in element['insertItems']) {
              el['id_lr'] = newResearchId;
            }
          }

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

      this.refreshAll(this.currentCategoryId);
    }
  },
  components: {
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
  z-index: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
}

.search-input {
  width: 100%;
}
</style>
