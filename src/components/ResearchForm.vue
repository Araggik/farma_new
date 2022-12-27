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
               <select id="categoryResearchField" @click="loadCategories" 
               @change="dirtyMap['lab_research'] = true"
               v-model="researchData['lab_research']['id_clr']">
                    <option v-for="category in categories" :key="category['id_clr']"
                    :value="category['id_clr']">
                        {{ category['name_clr'] }}
                    </option>               
               </select>
            </div>

            <!--Поля исследования-->
            <div v-for="(value, key) in visibleResearchFieldMap" :key="key"
            class="form__field">
               <label :for="key+'ResearchField'">
                    {{ value+':' }}
               </label>
               <input :id="key+'ResearchField'" :value="researchData['lab_research'][key]"
               v-model="researchData['lab_research'][key]"
               @change="dirtyMap['lab_research'] = true"
               :type="typeof(researchData['lab_research'][key]) == 'boolean' ? 'checkbox' : 'text'">
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
                        <li v-for="bioMaterial in researchData['bm_of_study']"
                        :key="bioMaterial['id_bms']" class="form__list-item">
                            <div class="oveflow-ellipsis"
                            :style="bioMaterial['na'] ? {} : {'font-weight': 'bolder'}">   
                                {{ bioMaterial['bio_materials']['name_bm']}}
                            </div>
                            <Done v-if="material['na']"/>
                            <Close v-else/>
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
                        <li v-for="material in researchData['use_m']"
                        :key="material['id_um']" class="form__list-item">
                            <div class="oveflow-ellipsis" 
                            :style="material['na'] ? {} : {'font-weight': 'bolder'} ">
                                {{ material['materials']['name_m']}}
                            </div>
                            <Done v-if="material['na']"/>
                            <Close v-else/>
                        </li>
                    </ul>
                </div>
            </div> 

            <!--Окно с таблицей-->
            <div class="form__table-window">
                <div class="form__table-name">
                    <div class="form__table-name-text">
                        Нюансы исследований
                    </div>
                    <button @click.prevent>Добавить</button>
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
                            researchData['laboratorys_options']"
                            :key="researchOption['id_lo']"
                            :style="researchOption['na'] ? {} : {'font-weight': 'bolder'} ">
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
import Done from 'vue-material-design-icons/Close.vue';
import Close from 'vue-material-design-icons/Close.vue';

export default {
    props: ['data', 'api'],
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
            dirtyMap: {
                'lab_research': false,
                'bm_of_study': false,
                'use_m': false,
                'laboratorys_options': false
            },
            newData: {},
            researchData: JSON.parse(JSON.stringify(this.data)),
            categories: [this.data['category_lr']]
        };
    },  
    methods: {
        async loadCategories(){
            const categoryResponse = await this.api.get('category_lr?order=name_clr.asc');

            this.categories = categoryResponse.data;
        },
        onButtonClick(flag){
            if(flag){
               for(let key in this.dirtyMap) {
                    if (this.dirtyMap[key]) {
                        this.newData[key] = this.researchData[key];

                        //Удаляем лишние поля
                        if (key == 'bm_of_study') {
                            delete this.newData[key]['bio_materials'];
                        } else if (key == 'use_m') {
                            delete this.newData[key]['materials']; 
                        } else if (key == 'laboratorys_options') {
                            delete this.newData[key]['laboratories'];
                        }
                    }
               }
            }

            this.$emit('formClose', this.newData);
        }
    },
    components: {
        Close,
        Done
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