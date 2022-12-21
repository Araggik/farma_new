<template>
   <div class="category-window">
      <div class="category-header">
         <p class="category-header__text">Категории</p>
         <button class="category-header__btn">Добавить</button>
      </div>
      <CategoryTree :tree="{category: null, children: categoryTree}"
      @category-click="(category)=>{$emit('changeCategory', category)}"/>   
   </div> 
</template>

<script>
import CategoryTree from './CategoryTree.vue';

export default {
   props: ['categoryTree'],
   emits: ['changeCategory'],
   components: {
    CategoryTree
   }
}
</script>

<style scoped>
.category-header {
   display: flex;
}

.category-header__text {
   flex: 3;
}

.category-header__btn {
   flex: 1;
}
</style>