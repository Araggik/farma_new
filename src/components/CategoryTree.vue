<template>
    <li v-if="tree.category" @click="onClick" class="category-name">
        <ChevronRight v-if="tree.children.length>0" 
        :class="{'rotated': isVisible}">
        </ChevronRight>
        <p :class="{'category-name__text_bold': tree.category['id_parent'] == 0}">
            {{ tree.category['name_clr'] }}
        </p>     
    </li>
    <ul v-if="tree.children.length >0" v-show="isVisible"
    class="category-list" 
    :class="{'category-list_margined': tree.category}">
        <CategoryTree v-for="el in tree.children" :key="el.category['id_clr']" :tree="el">
        </CategoryTree>
    </ul>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';

export default {
    name: 'CategoryTree',
    props: ['tree'],
    emits:  ['categoryClick'],
    data(){
        return {
            isVisible: this.tree.category ? false : true,
        };
    },
    methods: {
        onClick(){
            this.$emit('categoryClick', this.tree.category);
            this.isVisible = !this.isVisible;
        }
    },
    components: {
        ChevronRight,
    }
}
</script>

<style>
.rotated {
    transform: rotate(90deg);
}
.category-name {
    display: flex;
    align-items: center;
}

.category-name__text_bold {
    font-weight: bold;
}

/* .category-list {
    background-color: white;
} */
.category-list_margined {
    margin-left: 10px;
}
</style>