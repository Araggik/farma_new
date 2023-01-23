<template>
<div class="modal-layout">
        <form class="form">
            <div class="form__head">
                {{ formName }}
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='name_mMaterialField' class="form__field-label">
                    {{ 'Название:' }}
                </label>
        
               <input v-if="isBioMaterial" id='name_mMaterialField' 
               v-model="materialData['id_bm']"
               class="form__field-input"> 
               
               <input v-else id='name_mMaterialField' 
               v-model="materialData['id_m']"
               class="form__field-input"> 
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='name_clrCategoryField' class="form__field-label">
                    {{ 'Удалено:' }}
                </label>

                <input id='name_clrCategoryField' v-model="materialData['na']"
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
    props: ['isBioMaterial', 'data'],
    emits: ['materialFormClose'],
    data(){
        return {
            lastPictureIndex: 87,
            materialData: Object.assign({},this.data)
        }
    },
    computed: {
        formName(){
            let name = '';

            if (this.isBioMaterial) {
                if (this.materialData['id_bm']) 
                    name = 'Редактирование био материала';
                else
                    name = 'Добавление био материала'; 
            } else {
                if (this.materialData['id_m'])
                    name = 'Редактирование материала';
                else 
                    name = 'Добавление материала';    
            }

            return name;
        },
        onButtonClick(flag){
            if (flag) {
                this.$emit('materialFormClose', this.materialData);
            } else 
                this.$emit('materialFormClose', null);              
        }
    }
}
</script>

<style>

</style>