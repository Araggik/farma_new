<template>
    <li class="category-list__item">
        <div class="category-name" @click="onClick" 
        :class="{'category-name_blue': tree['isCurrentCategory'] }"
        @mouseover="isEditVisible = true"
        @mouseleave="isEditVisible = false">
            <div class="category-name__text">
                <ChevronRight v-if="tree.children.length>0" 
                :class="{'rotated': isVisible}">
                </ChevronRight>
                <p :class="{'category-name__text_bold': tree.category['id_parent'] == 0}">
                    {{ tree.category['name_clr'] }}
                </p>
            </div>
            <Edit v-if="isEditVisible"></Edit>
        </div>
        <ul v-if="tree.children.length >0" v-show="isVisible"
        class="category-list"  :class="{'category-list_margined': tree.category}">
            <CategoryTree v-for="el in tree.children" :key="el.category['id_clr']" :tree="el"
            @category-click="(categoryId)=>$emit('categoryClick', categoryId)">
            </CategoryTree>
        </ul>   
    </li>
</template>

<script>
import Edit from 'vue-material-design-icons/BorderColor.vue';
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';

export default {
    name: 'CategoryTree',
    props: ['tree'],
    emits:  ['categoryClick'],
    data(){
        return {
            isVisible: false,
            isEditVisible: false
        };
    },
    methods: {
        onClick(){
            this.$emit('categoryClick', this.tree.category['id_clr']);
            this.isVisible = !this.isVisible;
        }
    },
    components: {
        ChevronRight,
        Edit
    }
}
</script>

<style scoped>
.rotated {
    transform: rotate(90deg);
}
.category-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.category-name:hover {
    cursor: pointer;
    text-decoration: underline;
}

.category-name_blue {
    background-color: rgba(151,224,252,255);
}

.category-name__text {
    display: flex;
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

.category-list__item {
    margin-top: 5px;
}
</style>