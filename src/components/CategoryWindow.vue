<template>
   <div class="category-window">
      <div class="category-header">
         <p class="category-header__text">Категории</p>
         <button class="category-header__btn"
         @click="$emit('addClick')">
            Добавить
         </button>
      </div>

      <ul class="first-category-list">
         <CategoryTree v-for="el in categoryTree" :key="el.category['id_clr']" :tree="el"
         @category-click="(categoryId)=> $emit('changeCategory', categoryId)"
         @category-edit="(categoryId)=> $emit('categoryEdit', categoryId)"/>
      </ul>
        
   </div> 
</template>

<script>
import CategoryTree from './CategoryTree.vue';

export default {
   props: ['categoryTree'],
   emits: ['changeCategory','addClick', 'categoryEdit'],
   components: {
    CategoryTree
   }
}
</script>

<style scoped>
.category-window {
   border: 2px solid black;
   background-color: white;
}

.category-header {
   display: flex;
   border-bottom: 2px solid black;
   padding: 2px;
}

.category-header__text {
   flex: 3;
   font-weight: bolder;
   font-size: 1.2rem;
}

.category-header__btn {
   flex: 1;
}
</style>