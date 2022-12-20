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
      <ResearchWindow/>
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
      categoryTree: [],
      //Фильтры для сущностей в виде url параметров (NA и др.)
      allUrlParams: {
        category: [
          'order=name_clr.asc'
        ],
        research: [],
        oprions: []
      }    
    };
  },
  computed: {
    categoryUrlParams(){
      return '&' +this.allUrlParams['category'].join('&');
    }
  },
  methods: {
    //Возвращает [{category: category, children: []}]
    makeCategoryTree(categories, parentId){
      let tree = [];

      const children = categories.filter((element)=>element['id_parent'] == parentId);

      for(let element of children){
        tree.push({
          category: element,
          children: this.makeCategoryTree(categories, element['id_clr'])
        });
      }

      return tree;
    },
    async refreshCategory(){
      try {
        const table = 'category_lr?'

        const categoryResponse = await this.api.get(table+this.categoryUrlParams);

        const categories = categoryResponse.data;

        this.categoryTree = this.makeCategoryTree(categories, 0);

      } catch(e) {
        console.log('Category fetch error');
        console.log(e);
      }    
    },
    onChangeCategory(category){
      alert(category['name_clr']);
    }
  },
  components: {
    CategoryWindow,
    FilterField,
    ResearchWindow,
  },
  mounted(){
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
