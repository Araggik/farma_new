<template>
<div class="modal-layout modal-layout_z_2">
        <form class="form form_size_medium">
            <div class="form__head">
                {{ formName }}
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='name_mMaterialField' class="form__field-label">
                    {{ 'Название:' }}
                </label>
        
               <input v-if="isBioMaterial" id='name_mMaterialField' 
               v-model="materialData['name_bm']"
               class="form__field-input"> 
               
               <input v-else id='name_mMaterialField' 
               v-model="materialData['name_m']"
               class="form__field-input"> 
            </div>

            <div v-if="isBioMaterial" class="form__field overflow-ellipsis">

                <label for='image_indexMaterialField' class="form__field-label">
                    {{ 'Картинка:' }}
                </label>

                <div>
                    <button @click.prevent="isPictureListVisible = !isPictureListVisible"
                    id="image_indexMaterialField" class="picture-button">
                        <img :src="require('../assets/Biomaterials/'+
                        materialData['image_index']+'.png')">

                        <ChevronRight :class="{'rotated': isPictureListVisible}"/>                       
                    </button>     

                    <ul v-if="isPictureListVisible" class="picture-list">
                        <li v-for="index in lastPictureIndex" :key="index"
                        class="picture-list__item" @click="onPictureClick(index)">
                            <img :src="require(`../assets/Biomaterials/${index}.png`)" class="picture">
                        </li>
                    </ul>                 
                </div>               
            </div>

            <div v-if="isNewMaterial" class="form__field overflow-ellipsis">

                <label for='naMaterialField' class="form__field-label">
                    {{ 'Удалено:' }}
                </label>

                <input id='naMaterialField' v-model="materialData['na']"
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
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'; 

export default {
    props: ['isBioMaterial', 'data'],
    emits: ['materialFormClose'],
    data(){
        return {
            lastPictureIndex: 87,
            isPictureListVisible: false,
            materialData: Object.assign({},this.data)
        }
    },
    computed: {
        isNewMaterial(){
            return ('id_bm' in this.materialData) || ('id_m' in this.materialData);
        },
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
    },
    methods: {
        onPictureClick(index){
            this.materialData['image_index'] = index;

            this.isPictureListVisible = false;
        },
        onButtonClick(flag){
            if (flag) {
                this.$emit('materialFormClose', this.materialData);
            } else 
                this.$emit('materialFormClose', null);              
        }
    },
    components: {
        ChevronRight
    }
}
</script>

<style scoped>
.rotated {
    transform: rotate(90deg);
}

.picture-button {
    display: flex;
}

.picture-list {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    background-color: lightgray;
    border: 1px solid black;
    list-style-type: none;
    height: 200px;
    width: 180px;
    overflow: auto;
    gap: 2px 2px;
}

.picture-list__item:hover {
    border: 1px solid black;
}

.picture {
    width: 30px;
    height: 30px;
}
</style>