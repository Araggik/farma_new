<template>
    <div class="modal-layout">
        <form class="form">
            <div class="form__head">
                {{ formName }}
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='parentCategoryField' class="form__field-label">
                    Категория-родитель:
                </label>
                
                <select id="parentCategoryField" @click="loadCategories" 
                v-model="categoryData['id_parent']" class="category-select">
                        <option v-for="category in categories" :key="category['id_clr']"
                        :value="category['id_clr']">
                            {{ category['name_clr'] }}
                        </option>               
                </select>
                            
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='name_clrCategoryField' class="form__field-label">
                    {{ 'Название:' }}
                </label>

            
               <input id='name_clrCategoryField' v-model="categoryData['name_clr']"
               class="form__field-input">     
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='name_clrCategoryField' class="form__field-label">
                    {{ 'Удалено:' }}
                </label>

                <input id='name_clrCategoryField' v-model="categoryData['na']"
                type="checkbox">      
            </div>

            <!--Кнопки формы-->
            <div class="form__buttons">
                <button class="form__button" @click="onButtonClick(true)" type="submit">
                    {{ 'ОК' }}
                </button>
                <button class="form__button" @click="onButtonClick(false)">
                    {{ 'Отмена' }}
                </button>
            </div> 
        </form>
    </div>
</template>

<script>
export default {
    props: ['api', 'data'],
    emits: ['categoryFormClose'],
    data(){
        return {
            categories: [{
                'id_clr': this.data['id_parent'],
                'name_clr': this.data['parentName']
            }],
            categoryData: Object.assign({},this.data)
        };
    },
    computed: {
        isNewCategory(){
            return !('id_clr' in this.data) ;
        },
        formName(){
            return this.isNewCategory ? 'Добавление категории'
                : 'Редактирование категории';
        },
        
    },
    methods: {
        async loadCategories(){
            const categoryResponse = await this.api.get('category_lr?order=name_clr.asc');

            this.categories = [{
                'id_clr': 0,
                'name_clr': '-'
            }];
            
            this.categories.push(...categoryResponse.data);
        },
        onButtonClick(flag){
            if (flag) {
                delete this.categoryData['parentName'];
                this.$emit('categoryFormClose', this.categoryData);
            } else 
                this.$emit('categoryFormClose', null);               
        }
    }
}
</script>

<style scoped>
.category-select {
    width: 100%;
}
</style>