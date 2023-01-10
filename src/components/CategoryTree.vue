<template>
    <li class="category-list__item">
        <div class="category-name" @click="onClick" 
        :class="{'category-name_gray': isEven,
        'category-name_blue': tree['isCurrentCategory'] }"
        @mouseover="isEditVisible = true"
        @mouseleave="isEditVisible = false">
            <div class="category-name__chevron-text">
                <ChevronRight v-if="tree.children.length>0" 
                :class="{'rotated': isVisible}">
                </ChevronRight>
                <p class="category-name__text" 
                :class="{'category-name__text_bold': isRoot,
                'category-name__text_italic': tree.category['na']}">
                    {{ tree.category['name_clr'] }}
                </p>
            </div>
            <Edit v-if="isEditVisible" class="category-name__edit"
            @click.stop="$emit('categoryEdit', tree.category['id_clr'])">
            </Edit>
        </div>
        <ul v-if="tree.children.length >0" v-show="isVisible"
        class="category-list" :class="{'category-list_margined': tree.category}"> 
            <CategoryTree v-for="(el, index) in tree.children" :key="el.category['id_clr']" :tree="el" :isRoot="false"
            :isEven="index % 2 == 0"
            @category-click="(categoryId)=>$emit('categoryClick', categoryId)"
            @category-edit="(categoryId)=>$emit('categoryEdit', categoryId)">
            </CategoryTree>
        </ul>   
    </li>
</template>

<script>
import Edit from 'vue-material-design-icons/BorderColor.vue';
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue';

export default {
    name: 'CategoryTree',
    props: ['tree', 'isRoot', 'isEven'],
    emits:  ['categoryClick', 'categoryEdit'],
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
    padding: 1px;
}

.category-name:hover {
    cursor: pointer;
    text-decoration: underline;
}

.category-name_gray {
    background-color: lightgray;
}

.category-name_blue {
    background-color: rgba(151,224,252,255);
}

.category-name__chevron-text {
    display: flex;
    align-items: center;
}

.category-name__text {
    font-size: 0.95rem;   
    line-height: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 1.9rem;
}

.category-name__text_bold {
    font-weight: bold;
}

.category-name__text_italic {
    font-style: italic;
}

.category-name__edit:hover {
    background-color: rgba(239,239,239,255);
}

/* .category-list {
    background-color: white;
} */

.category-list_margined {
   margin-left: 10px;
} 

</style>