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
                        <button @click.prevent="onAddBioMaterial()"> 
                            {{ 'Добавить' }}
                        </button>
                    </div>
                    <ul class="form__list-body">

                        <li v-if="isBioMaterialAdding" class="form__list-item">
                            <select v-model="newBioMaterial" class="adding-select 
                            overflow-ellipsis">
                                <option v-for="bioMaterial in bioMaterials"
                                :key="bioMaterial['id_bm']"
                                :value="bioMaterial">
                                    {{ bioMaterial['name_bm'] }}
                                </option>
                            </select>
                            <div class="icons">
                                <Done class="icon" @click="onAddedBioMaterial(true)"></Done>
                                <Close class="icon" @click="onAddedBioMaterial(false)"></Close>
                            </div>                           
                        </li>


                        <li v-for="bioMaterial in naSortedBioMaterials"
                        :key="bioMaterial['id_bms']" class="form__list-item">
                            <div class="oveflow-ellipsis"
                            :style="bioMaterial['na'] ? {} : {'font-weight': 'bolder'}">   
                                {{ bioMaterial['bio_materials']['name_bm']}}
                            </div>
                            <Done v-if="bioMaterial['na']" class="icon"
                            @click="onClickIcon(bioMaterial, false, 'bm_of_study')" />
                            <Close v-else class="icon"
                            @click="onClickIcon(bioMaterial, true, 'bm_of_study')"/>
                        </li>
                    </ul>
                </div>

                <!--Список материалов-->
                <div class="form__list">
                    <div class="form__list-head">
                        <div>
                            {{ 'Расходные материалы' }}
                        </div>         
                        <button @click.prevent="onAddMaterial()"> 
                            {{ 'Добавить' }}
                        </button>
                    </div>
                    <ul class="form__list-body">
                        <li v-if="isMaterialAdding" class="form__list-item">
                            <select v-model="newMaterial" class="adding-select 
                            overflow-ellipsis">
                                <option v-for="material in materials"
                                :key="material['id_m']"
                                :value="material">
                                    {{ material['name_m'] }}
                                </option>
                            </select>
                            <div class="icons">
                                <Done class="icon" @click="onAddedMaterial(true)"></Done>
                                <Close class="icon" @click="onAddedMaterial(false)"></Close>
                            </div>                           
                        </li>

                        <li v-for="material in naSortedMaterials"
                        :key="material['id_um']" class="form__list-item">
                            <div class="oveflow-ellipsis" 
                            :style="material['na'] ? {} : {'font-weight': 'bolder'} ">
                                {{ material['materials']['name_m']}}
                            </div>
                            <Done v-if="material['na']" class="icon"
                            @click="onClickIcon(material, false, 'use_m')"/>
                            <Close v-else class="icon"
                            @click="onClickIcon(material, true, 'use_m')"/>
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
                            naSortedOptions"
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
import Close from 'vue-material-design-icons/Close.vue';
import Done from 'vue-material-design-icons/Check.vue';

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
            newData: [],
            researchData: JSON.parse(JSON.stringify(this.data)),
            isBioMaterialAdding: false,
            isMaterialAdding: false,
            newBioMaterial: null,
            newMaterial: null,
            materials: [],
            bioMaterials: [],
            categories: [this.data['category_lr']]
        };
    },
    computed: {
        naSortedBioMaterials(){
            // eslint-disable-next-line
            return this.researchData['bm_of_study'].sort(this.sortNaEntities);
        },
        naSortedMaterials(){
            // eslint-disable-next-line
            return this.researchData['use_m'].sort(this.sortNaEntities);
        },
        naSortedOptions(){
            // eslint-disable-next-line
            return this.researchData['laboratorys_options'].sort(this.sortNaEntities);
        }
    }, 
    methods: {
        onClickIcon(element, value, table){
            element['na'] = value;

            this.dirtyMap[table] = true;
        },
        onAddedMaterial(isAdded) {
            if (isAdded) {
                this.researchData['use_m'].push({
                    'id_lr': this.researchData['lab_research']['id_lr'],
                    'id_m': this.newMaterial['id_m'],
                    'na': false,
                    'qty_m': 1,
                    'materials': {
                        'name_m': this.newMaterial['name_m']
                    }
                });

                this.dirtyMap['use_m'] = true
            }

            this.isMaterialAdding = false;
        },
        onAddedBioMaterial(isAdded) {
            if (isAdded) {
                this.researchData['bm_of_study'].push({
                    'id_lr': this.researchData['lab_research']['id_lr'],
                    'id_bm': this.newBioMaterial['id_bm'],
                    'na': false,
                    'bio_materials': {
                        'name_bm': this.newBioMaterial['name_bm']
                    }
                });

                this.dirtyMap['bm_of_study'] = true;
            }

            this.isBioMaterialAdding = false;
        },
        async onAddBioMaterial(){
            if ( !this.isBioMaterialAdding) {
                const bioMaterialsResponse = await 
                    this.api.get('bio_materials?order=name_bm.asc');

                this.bioMaterials = bioMaterialsResponse.data;

                this.newBioMaterial = this.bioMaterials[0];

                this.isBioMaterialAdding = true;
            }
        },
        async onAddMaterial() {
            if ( !this.isMaterialAdding) {
                const materialsResponse = await 
                    this.api.get('materials?order=name_m.asc');

                this.materials = materialsResponse.data;

                this.newMaterial = this.materials[0];

                this.isMaterialAdding = true;
            }
        },
        sortNaEntities(a, b){
            if (a['na'] && !b['na'])
                return 1;
            if (!a['na'] && b['na'])    
                return -1;
            return 0;
        },
        async loadCategories(){
            const categoryResponse = await this.api.get('category_lr?order=name_clr.asc');

            this.categories = categoryResponse.data;
        },
        onButtonClick(flag){
            if(flag){
               for(let key in this.dirtyMap) {
                    if (this.dirtyMap[key]) {
                        let tableChanges = {
                            'table': key,
                            'postItems': [],
                            'deleteItems': []  
                        };

                        if (key == 'lab_research') {

                            tableChanges['postItems'].push(this.researchData['lab_research']);

                        } else if (key == 'laboratorys_options') {

                            for(let option of this.researchData['laboratorys_options']) {
                                delete option['laboratories'];
                            }
                            tableChanges['postItems'] = this.researchData['laboratorys_options'];

                        } else if (key == 'bm_of_study' || key == 'use_m') {

                            const deleteKey = (key == 'bm_of_study') ? 'bio_materials' 
                                : 'materials';

                            for(let element of this.researchData[key]) {
                                delete element[deleteKey];

                                if (element['na']) {
                                    tableChanges['deleteItems'].push(element);
                                    
                                } else {
                                    tableChanges['postItems'].push(element);
                                }

                                delete element['na'];
                            }

                        }

                        this.newData.push(tableChanges);                  
                    }
               }
            }

            this.$emit('formClose', this.newData);

            //this.$emit('formClose', this.researchData);
        }
    },
    components: {
        Close,
        Done,
    }
}
</script>

<style scoped>
table, tr, td {
   border-collapse: collapse;
   border: 1px solid black;
}

.adding-select {
    max-width: 80%;
}

.cell { 
    overflow: hidden;
    text-overflow: ellipsis;
    width: 7rem;
    height: 3rem;
    padding: 2px;
    text-align: center;
}

.icons {
    display: flex;
}

.icon:hover {
    background-color: lightgray;
    cursor: pointer;
}
</style>