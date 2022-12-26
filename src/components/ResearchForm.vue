<template>
    <div class="modal-layout">
        <form class="form">
            <div class="form__head">
                {{ 'Редактирование исследования' }}
            </div>

            <!--Select для категории-->
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

            <!--Поля исследования-->
            <div v-for="(value, key) in visibleResearchFieldMap" :key="key"
            class="form__field">
               <label :for="key+'ResearchField'">
                    {{ value+':' }}
               </label>
               <input :id="key+'ResearchField'" :value="researchData['research'][key]"
               :type="typeof(researchData['research'][key]) == 'boolean' ? 'checkbox' : 'text'">
            </div>

            <!--Список био материалов-->
            <div class="form__lists">
                <div class="form__list">
                    <div class="form__list-head">
                        <div>
                            {{ 'Био материалы' }}
                        </div>
                        <button @click.prevent> {{ 'Добавить' }}</button>
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

                <!--Список материалов-->
                <div class="form__list">
                    <div class="form__list-head">
                        <div>
                            {{ 'Расходные материалы' }}
                        </div>         
                        <button @click.prevent> {{ 'Добавить' }}</button>
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

            <!--Окно с таблицей-->
            <div class="form__table-window">
                <div class="form__table-name">
                    Нюансы исследований
                </div>
                <div class="form__table-container">
                    
                    <table class="form__table">
                        <thead>
                            <tr>
                                <td v-for="value in visibleOptionFieldMap" :key="value">
                                    <div class="cell">
                                        {{ value }}
                                    </div>                          
                                </td>  
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="researchOption in 
                            researchData['research']['laboratorys_options']"
                            :key="researchOption['id_lo']">
                                <td v-for="(value, key) in visibleOptionFieldMap"
                                :key="key">
                                    <div class="cell">
                                        {{ researchOption[key] }}
                                    </div>                                  
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
                
            <!--Кнопки формы-->
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
            visibleOptionFieldMap: {
                'code_l': 'Код исследования',
                'old_code_l': 'Старый код исследования',
                'cost_lo': 'Цена исследования',
                'lead_time': 'Срок исследования',
                'fast_execution': 'Быстрое исследование',
                'fast_exec_cost': 'Цена быстрого исследования',
                'fast_exec_time': 'Срок быстрого исследования'
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

.cell { 
    overflow: hidden;
    text-overflow: ellipsis;
    width: 7rem;
    height: 3rem;
    padding: 2px;
    text-align: center;
}
</style>