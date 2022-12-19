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
    };
  },
  methods: {
    async printCategories(){
      try {
        let response = await api.getCategoriesByParent(0);
        console.log(response.data);
      } catch (error) {
        console.log('Запрос не прошел');
      }       
    }
  },
  components: {
    CategoryWindow,
    FilterField,
    ResearchWindow,
  },
  mounted(){
    this.printCategories();
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
