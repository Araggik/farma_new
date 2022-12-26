<template>
    <div class="modal-layout">
        <form class="form">
            <div class="form__head">
                {{ 'Редактирование исследования' }}
            </div>

            <div class="form__field">
               <label for='categoryResearchField'>
                    {{ 'Категория:' }}
               </label>
               <select id="categoryResearchField">
                    <option :value="researchData['category']['category_lr']['id_clr']">
                        {{ researchData['category']['category_lr']['name_clr'] }}
                    </option>               
               </select>
            </div>

            <div v-for="(value, key) in visibleResearchFieldMap" :key="key"
            class="form__field">
               <label :for="key+'ResearchField'">
                    {{ value+':' }}
               </label>
               <input :id="key+'ResearchField'" :value="researchData['research'][key]"
               :type="typeof(researchData['research'][key]) == 'boolean' ? 'checkbox' : 'text'">
            </div>

            <div class="form__lists">
                <div class="form__list">
                    <div class="form__list-head">
                        <div>
                            {{ 'Био материалы' }}
                        </div>
                        <button> {{ 'Добавить' }}</button>
                    </div>
                    <ul class="form__list-body">
                        <li v-for="bioMaterial in researchData['bioMaterials']['bm_of_study']"
                        :key="bioMaterial['id_bms']" class="form__list-item">
                            <div class="oveflow-ellipsis">
                                {{ bioMaterial['bio_materials']['name_bm']}}
                            </div>
                            <Close/>
                        </li>
                    </ul>
                </div>
                <div class="form__list">
                    <div class="form__list-head">
                        <div>
                            {{ 'Расходные материалы' }}
                        </div>         
                        <button> {{ 'Добавить' }}</button>
                    </div>
                    <ul class="form__list-body">
                        <li v-for="material in researchData['materials']['use_m']"
                        :key="material['id_um']" class="form__list-item">
                            <div class="oveflow-ellipsis">
                                {{ material['materials']['name_m']}}
                            </div>
                            <Close/>
                        </li>
                    </ul>
                </div>
            </div>

            <table class="form__table">

            </table>

            <div class="form__buttons">
                <button class="form__button" @click="onButtonClick(true)">
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
import Close from 'vue-material-design-icons/Close.vue';

export default {
    props: ['researchData', 'api'],
    emits: ['formClose'],
    data(){
        return {
            visibleResearchFieldMap: {
                'name_lr': 'Короткое имя',
                'full_name_lr': 'Полное имя',
                'desc_lr': 'Описание',
                'na': 'Не активно'
            },
            result: {
                result: false
            }
        };
    },
    methods: {
        onButtonClick(flag){
            if(flag){
                this.result['result'] = true;
            }

            this.$emit('formClose', this.result);
        }
    },
    components: {
        Close
    }
}
</script>

<style scoped>
table, tr, td {
   border-collapse: collapse;
   border: 1px solid black;
}

td {
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}


</style>