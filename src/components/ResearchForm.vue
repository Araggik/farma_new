<template>
    <div class="modal-layout">
        <form class="form" id="researchForm">
            <div class="form__head" @mousedown="onMouseDown">
                <div>
                    {{ formName }}
                </div>
                
                <div class="overflow-ellipsis">
                    {{ researchData['lab_research']['name_lr'] }}
                </div>
            </div>

            <!--Select для категории-->
            <div class="form__field overflow-ellipsis">

                <template v-if="!isNewResearch">
                    <span class="form__field-label">Категория: </span>
                    {{ researchData['category_lr']['name_clr'] }}
                </template>
               

                <template v-else>
                    <label for='categoryResearchField' class="form__field-label">
                        {{ 'Категория:' }}
                    </label>

                    
                    <select id="categoryResearchField" @click="loadCategories" 
                    @change="dirtyMap['lab_research'] = true"
                    v-model="researchData['lab_research']['id_clr']"
                    class='form__field-input'>
                            <option v-for="category in categories" :key="category['id_clr']"
                            :value="category['id_clr']">
                                {{ category['name_clr'] }}
                            </option>               
                    </select>
                </template>          
            </div>

            <!--Поля исследования-->
            <div v-for="(value, key) in visibleResearchFieldMap" :key="key"
            class="form__field">
               <label :for="key+'ResearchField'" class="form__field-label">
                    {{ value+':' }}
               </label>

               <textarea v-if="textAreaResearchFields.includes(key)" :id="key+'ResearchField'"
               @input="onAreaInput(key)"
               v-model="researchData['lab_research'][key]"
               @change="dirtyMap['lab_research'] = true"
               class="form__field-textarea" rows="4">
               </textarea>

               <input v-else :id="key+'ResearchField'" :value="researchData['lab_research'][key]"
               v-model="researchData['lab_research'][key]"
               @change="dirtyMap['lab_research'] = true"
               :type="typeof(researchData['lab_research'][key]) == 'boolean' ? 'checkbox' : 'text'"
               :class="{'form__field-input': typeof(researchData['lab_research'][key]) != 'boolean'}">
              
            </div>

            <!--Select для основной лаборатории -->
            <div class="form__field overflow-ellipsis">       
                <label for='laboratoryResearchField' class="form__field-label">
                    {{ 'Основная лаборатория:' }}
                </label>
                
                <select id="laboratoryResearchField" @click="loadLaboratories" 
                @change="dirtyMap['lab_research'] = true"
                v-model="researchData['lab_research']['current_laboratory']"
                class='form__field-input'>
                        <option v-for="laboratory in laboratories" :key="laboratory['id_labs']"
                        :value="laboratory['id_labs']"
                        :selected="laboratory['id_labs'] == researchData['lab_research']['current_laboratory']">
                            {{ laboratory['name_lab'] }}
                        </option>               
                </select>
                       
            </div>

            <!--Список био материалов-->
            <div class="form__lists">
                <div class="form__list-window">
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
                                <select v-model="newBioMaterial">
                                    <option v-for="bioMaterial in bioMaterials"                       
                                    :key="bioMaterial['id_bm']"
                                    :value="bioMaterial"
                                    :class="{'font-style_italic': bioMaterial['na']}">
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
                                <div class="bio-material-name"

                                :class="{'font-style_italic':
                                bioMaterial['bio_materials']['na']}" 

                                @click="onMaterialClick({
                                    isBioMaterial: true,                               
                                    materialId: bioMaterial['id_bm']
                                })"

                                :title="bioMaterial['bio_materials']['name_bm'].length > 40 ? 
                                bioMaterial['bio_materials']['name_bm'] : null">


                                    <img :src="require('../assets/Biomaterials/'+
                                    bioMaterial['bio_materials']['image_index']+'.png')"

                                    class="bio-material-name__icon">


                                    <div class="overflow-ellipsis"                     
                                    :style="bioMaterial['na'] ? {} : {'font-weight': 'bolder'}">   
                                        {{ bioMaterial['bio_materials']['name_bm']}}
                                    </div>
                                </div>
                                
                                <Done v-if="bioMaterial['na']" class="icon"
                                @click="onClickIcon(bioMaterial, false, 'bm_of_study')" />


                                <Close v-else class="icon"
                                @click="onClickIcon(bioMaterial, true, 'bm_of_study')"/>
                            </li>
                        </ul>                       
                    </div>

                    <button @click.prevent="onAddNewMaterial({isBioMaterial: true})"
                    class="add-new-material-button">
                        Добавить новый био материал
                    </button>
                </div>

                <!--Список материалов-->
                <div class="form__list-window">
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
                                <select v-model="newMaterial">
                                    <option v-for="material in materials"
                                    :key="material['id_m']"
                                    :value="material"
                                    :class="{'font-style_italic': material['na']}">
                                        {{ material['name_m'] }}
                                    </option>
                                </select>
                                <input v-model.number="newMaterialCount"
                                class="material-input-count">
                                <div class="icons">
                                    <Done class="icon" @click="onAddedMaterial(true)"></Done>
                                    <Close class="icon" @click="onAddedMaterial(false)"></Close>
                                </div>                           
                            </li>

                            <li v-for="material in naSortedMaterials"
                            :key="material['id_um']" class="form__list-item">
                                <div class="material-name overflow-ellipsis" 
                                
                                :class="{'font-style_italic':
                                material['materials']['na']}" 

                                :style="material['na'] ? {} : {'font-weight': 'bolder'} " 
                                @click="onMaterialClick({
                                    isBioMaterial: false,                               
                                    materialId: material['id_m']
                                })"
                                
                                :title="material['materials']['name_m'].length > 40 ? 
                                material['materials']['name_m'] : null">
                                    {{ material['materials']['name_m']}}
                                </div>


                                <div class="overflow-ellipsis">
                                    {{ material['qty_m']  }}
                                </div>


                                <Done v-if="material['na']" class="icon"
                                @click="onClickIcon(material, false, 'use_m')"/>
                                <Close v-else class="icon"
                                @click="onClickIcon(material, true, 'use_m')"/>
                            </li>
                        </ul>
                    </div>


                    <button @click.prevent="onAddNewMaterial({isBioMaterial: false})"
                    class="add-new-material-button">
                        Добавить новый материал
                    </button>
                </div>         
            </div> 

            <!--Окно с таблицей-->
            <div class="form__table-window">
                <div class="form__table-name">
                    <div class="form__table-name-text">
                        Лаборатории
                    </div>
                    <button @click.prevent="addLaboratoryOption">Добавить</button>
                </div>
                
                <div class="form__table-container">
                    
                    <table class="form__table">
                        <thead class="form__table-head">
                            <tr>
                                <td v-for="(value, key) in columnNameAndSpan" 
                                :key="key" :rowspan="value['rowSpan']"
                                :colspan="value['columnSpan']">
                                    <div class="cell cell_expanded">
                                        {{ key }}
                                    </div> 
                                </td>
                            </tr>
                            <tr>
                                <template v-for="(value, key) in visibleOptionFieldMap"
                                :key="key">
                                    <td v-if="!(value in columnNameAndSpan)">
                                        <div class="cell">
                                            {{ value }}
                                        </div> 
                                    </td>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="researchOption in 
                            naSortedOptions"
                            :key="researchOption['id_lo']"
                            :style="researchOption['na'] ? {} : {'font-weight': 'bolder'} ">
                                <td v-for="(value, key) in visibleOptionFieldMap"
                                :key="key" class="form__table-td">                                    
                                    <div class="cell"> 
                                        <select v-if="key == 'id_labs'"
                                        v-model="researchOption['id_labs']"
                                        @click="loadLaboratories"
                                        @change="dirtyMap['laboratorys_options'] = true"
                                        :title="laboratories.find(
                                            el=>el['id_labs'] == researchOption['id_labs']
                                        )['name_lab']"
                                        class="cell__input">
                                            <template v-if="laboratories.length >0">
                                                <option v-for="lab in laboratories"
                                                :key="lab['id_labs']"
                                                :value="lab['id_labs']" >
                                                    {{ lab['name_lab'] }}
                                                </option>
                                            </template>
                                            <option v-else :value="researchOption['id_labs']">
                                                {{researchOption['laboratories']['name_lab']}}
                                            </option>                                          
                                        </select> 
                                        <input v-else v-model="researchOption[key]"
                                        class="cell__input" 

                                        :title="researchOption[key].toString().length > 10 ? 
                                        researchOption[key] : null"

                                        :type="typeof(researchOption[key]) == 'boolean' ? 
                                        'checkbox' : 'text'"
                                        @change="dirtyMap['laboratorys_options'] = true">                                      
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

    <MaterialForm v-if="isMaterialFormVisible"
    :data="materialData" :is-bio-material="isBioMaterial"
    @material-form-close="onMaterialFormClose">
    </MaterialForm>
</template>

<script>
import Close from 'vue-material-design-icons/Close.vue';
import Done from 'vue-material-design-icons/Check.vue';
import MaterialForm from './MaterialForm.vue';

export default {
    props: ['data', 'api', 'isNotActive'],
    emits: ['researchFormClose'],
    data(){
        return {                    
            visibleResearchFieldMap: {
                'name_lr': 'Короткое имя',
                'full_name_lr': 'Полное имя',
                'desc_lr': 'Описание',
                'na': 'Удалено'
            },
            textAreaResearchFields: ['full_name_lr', 'desc_lr'],
            visibleOptionFieldMap: {            
                'id_labs': 'Лаборатория',
                'code_l': 'Код',
                'old_code_l': 'Старый код',
                'cost_lo': 'Цена',
                'lead_time': 'Срок',
                'fast_execution': 'Возможно',
                'fast_exec_cost': 'Цена',
                'fast_exec_time': 'Срок',
                'na': 'Удалено',
            },           
            columnNameAndSpan: {
                'Лаборатория': {
                    rowSpan: 2,
                    columnSpan: 1
                },
                'Код': {
                    rowSpan: 2,
                    columnSpan: 1
                },
                'Старый код': {
                    rowSpan: 2,
                    columnSpan: 1
                },
                'Обычное': {
                    rowSpan: 1,
                    columnSpan: 2
                },
                'Ускоренное': {
                    rowSpan: 1,
                    columnSpan: 3
                },
                'Удалено': {
                    rowSpan: 2,
                    columnSpan: 1
                },
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
            newMaterialCount: 1,
            materials: [],
            bioMaterials: [],         
            laboratories: this.data['laboratories'],
            categories: [this.data['category_lr']],
            isBioMaterial: true,
            editingMaterialId: null,
            materialData: null,
            isMaterialFormVisible: false,
            posX: null,
            posY: null,
            formElement: null
        };
    },
    computed: {
        naUrlParam(){
            let param = '';

            if(!this.isNotActive) {
                param = 'na=eq.false'
            }

            return param;
        },
        isNewResearch(){
            return !('id_lr' in this.researchData['lab_research']);
        },
        formName(){
            return this.isNewResearch 
                ? 'Добавление исследования'
                : 'Редактирование исследования';
        },
        naSortedBioMaterials(){
            // eslint-disable-next-line
            const sortedList = this.researchData['bm_of_study'].sort(
                this.sortByField('bio_materials', 'name_bm'));

            // eslint-disable-next-line
            return sortedList.sort(this.sortNaEntities);
        },
        naSortedMaterials(){
            // eslint-disable-next-line
            const sortedList = this.researchData['use_m'].sort(
                this.sortByField('materials', 'name_m'));

            // eslint-disable-next-line
            return sortedList.sort(this.sortNaEntities);
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
                    'qty_m': this.newMaterialCount,
                    'materials': {
                        'name_m': this.newMaterial['name_m']
                    }
                });

                this.dirtyMap['use_m'] = true
            }

            this.newMaterialCount = 1;

            this.isMaterialAdding = false;
        },
        onAddedBioMaterial(isAdded) {
            if (isAdded) {
                this.researchData['bm_of_study'].push({
                    'id_lr': this.researchData['lab_research']['id_lr'],
                    'id_bm': this.newBioMaterial['id_bm'],
                    'na': false,
                    'bio_materials': {
                        'name_bm': this.newBioMaterial['name_bm'],
                        'image_index': this.newBioMaterial['image_index']
                    }
                });

                this.dirtyMap['bm_of_study'] = true;
            }

            this.isBioMaterialAdding = false;
        },
        async onAddBioMaterial(){
            if ( !this.isBioMaterialAdding) {
                const bioMaterialsResponse = await 
                    this.api.get('bio_materials?order=na.asc,name_bm.asc&'+
                        this.naUrlParam);

                this.bioMaterials = bioMaterialsResponse.data;

                this.newBioMaterial = this.bioMaterials[0];

                this.isBioMaterialAdding = true;
            }
        },
        async onAddMaterial() {
            if ( !this.isMaterialAdding) {
                const materialsResponse = await 
                    this.api.get('materials?order=na.asc,name_m.asc&'+
                        this.naUrlParam);

                this.materials = materialsResponse.data;

                this.newMaterial = this.materials[0];

                this.isMaterialAdding = true;
            }
        },
        sortByField(fieldName, fieldName2){
            return function(a,b) {
                if (a[fieldName][fieldName2].toLowerCase() < 
                    b[fieldName][fieldName2].toLowerCase())
                    return -1;
                if (a[fieldName][fieldName2].toLowerCase() > 
                    b[fieldName][fieldName2].toLowerCase())
                    return 1;
                return 0;        
            };
        },
        sortNaEntities(a, b){
            if (a['na'] && !b['na'])
                return 1;
            if (!a['na'] && b['na'])    
                return -1;
            return 0;
        },
        async loadLaboratories(){
            const laboratoryResponse = await this.api.get('laboratories?order=name_lab.asc');

            this.laboratories = laboratoryResponse.data;
        },      
        async addLaboratoryOption(){
            await this.loadLaboratories();
           
            this.researchData['laboratorys_options'].push({
                'id_lr': this.researchData['lab_research']['id_lr'],
                'id_labs': this.laboratories[0]['id_labs'],
                'code_l': '',
                'old_code_l': '',
                'desc_lo': '',
                'fast_execution' : false,               
                'cost_lo': 0,
                'fast_exec_cost': 0,
                'lead_time': 24,
                'fast_exec_time': '',
                'na': false,
                'laboratories': {
                    'name_lab': this.laboratories[0]['name_lab']
                }
            });

            this.dirtyMap['laboratorys_options'] = true;
        },
        onAreaInput(key){
            if (this.researchData['lab_research'][key].length > 1000){
                this.researchData['lab_research'][key] = 
                    this.researchData['lab_research'][key].slice(0, 1000);
            }
        },
        onAddNewMaterial(data){
            this.isBioMaterial = data.isBioMaterial;

            if (this.isBioMaterial) {
                this.materialData = {
                    'name_bm': 'Новый био материал',
                    'na': false,
                    'image_index': 1
                };
            } else {
                this.materialData = {
                    'name_m': 'Новый материал',
                    'na': false,
                };
            }

            this.isMaterialFormVisible = true;
        },
        async onMaterialClick(data){
            this.isBioMaterial = data.isBioMaterial;

            let materialResponse;

            if (this.isBioMaterial) {
                materialResponse =  
                    await this.api.get(`bio_materials?id_bm=eq.${data.materialId}`);
            } else {
                materialResponse =  
                    await this.api.get(`materials?id_m=eq.${data.materialId}`);
            }

            this.materialData = materialResponse.data[0];

            this.isMaterialFormVisible = true;
        },
        async onMaterialFormClose(newMaterial){
            this.isMaterialFormVisible = false;

            if (newMaterial) {
                let materialTableName = 'materials?';

                if (this.isBioMaterial) {
                    materialTableName = 'bio_materials?';
                }

                try {
                    await this.api.post(materialTableName, newMaterial, {
                        headers: {
                            'Prefer': 'resolution=merge-duplicates'
                        }
                    });

                    
                    if ('id_m' in newMaterial) {
                        const changedIndex = this.researchData['use_m'].findIndex(
                            el=> el['id_m'] == newMaterial['id_m']);
                        
                        //Скрытие удаленного материала, если нет флажка na
                        if (!this.isNotActive && newMaterial['na'])
                            this.researchData['use_m'].splice(changedIndex, 1);
                        //Изменение соответствующего материала в списке формы исследования
                        else      
                            this.researchData['use_m'][changedIndex]['materials'] 
                                = newMaterial;    
                                    
                    } else if ('id_bm' in newMaterial) {
                        const changedIndex = this.researchData['bm_of_study'].findIndex(
                            el=> el['id_bm'] == newMaterial['id_bm']);
                        
                        if (!this.isNotActive && newMaterial['na'])
                            this.researchData['bm_of_study'].splice(changedIndex, 1);
                        else      
                            this.researchData['bm_of_study'][changedIndex]['bio_materials'] 
                                = newMaterial;
                    } 
                    
                } catch (error) {
                    
                    console.log(error);

                } 
                
                //Отправка na: false, если элемент с новым именем удален
                if (!('id_m' in newMaterial) && !(this.isBioMaterial)) {
                    await this.api.patch('materials?name_m=eq.'+newMaterial['name_m'], {'na': false});

                } else if (!('id_bm' in newMaterial) && this.isBioMaterial) {
                    await this.api.patch('bio_materials?name_bm=eq.'+newMaterial['name_bm'], {'na': false});
                }
            }
        },
        onMouseDown(event){
            this.formElement = document.getElementById('researchForm');

            this.formElement.style.position = 'absolute';

            this.posX = event.clientX;
            this.posY = event.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = this.elementDrag;

            function closeDragElement(){
                document.onmouseup = null;
                document.onmousemove = null;
            }
        },
        elementDrag(e){
            this.formElement.style.top = (this.formElement.offsetTop - 
                (this.posY - e.clientY)) + "px";
            this.formElement.style.left = (this.formElement.offsetLeft - 
                (this.posX - e.clientX)) + "px";

            this.posX = e.clientX;
            this.posY = e.clientY;    
        },       
        onButtonClick(flag){
            if(flag){
               //При добавлении нового исследования
               if (this.isNewResearch){
                    this.dirtyMap['lab_research'] = true;
               }

               for(let key in this.dirtyMap) {
                    if (this.dirtyMap[key]) {
                        let tableChanges = {
                            'table': key,
                            'updateItems': [],
                            'insertItems': [],
                            'deleteItems': [],
                        };

                        if (key == 'lab_research') {

                            tableChanges['updateItems'].push(this.researchData['lab_research']);

                        } else if (key == 'laboratorys_options') {

                            for(let option of this.researchData['laboratorys_options']) {
                                delete option['laboratories'];
                                //Лучше использовать in
                                if ('id_lo' in option){
                                    tableChanges['updateItems'].push(option);
                                } else {
                                    tableChanges['insertItems'].push(option);
                                }
                            }
                        } else if (key == 'bm_of_study' || key == 'use_m') {

                            const deleteKey = (key == 'bm_of_study') ? 'bio_materials' 
                                : 'materials';

                            const nameFieldId =  (key == 'bm_of_study') ? 'id_bms' 
                                : 'id_um';   

                            for(let element of this.researchData[key]) {
                                delete element[deleteKey];

                                if (element['na'] && (nameFieldId in element)) {
                                    tableChanges['deleteItems'].push(element);
                                    
                                } else if (!element['na'] && !(nameFieldId in element)){
                                    tableChanges['insertItems'].push(element);
                                }

                                delete element['na'];
                            }

                        }

                        this.newData.push(tableChanges);                  
                    }
               }
            }

            this.$emit('researchFormClose', this.newData);
        },
        async loadCategories(){
            const categoryResponse = await this.api.get('category_lr?order=name_clr.asc');

            this.categories = categoryResponse.data;
        },
    },
    components: {
        Close,
        Done,
        MaterialForm
    }
}
</script>

<style scoped>
table, tr, td {
   border-collapse: collapse;
   border: 1px solid black;
}

select, option {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.form__list-body {
    padding-left: 4px;
}

.bio-material-name {
    display: flex;
    align-items: center;
    width: 85%;
}

.bio-material-name:hover {
    text-decoration: underline;
    cursor: pointer;
}

.bio-material-name__icon {
    margin-right: 4px;
}

.material-name {
    width: 75%;
}

.material-name:hover {
    text-decoration: underline;
    cursor: pointer;
}

.material-input-count {
    width: 15%;
}

.add-new-material-button {
    width: 100%;
    height: 1.5rem;
}

.form__table-head {
    font-weight: bolder;
}

.form__table-td {
    padding: 0;
}

.cell { 
    overflow: hidden;
    text-overflow: ellipsis;
    width: 6rem;
    /* height: 2.2rem; */
    padding: 2px; 
    text-align: center;
}

.cell_expanded {
    width: 100%;
}

.cell__input {
    border: none;
    width: 100%;
}

.icons {
    display: flex;
}

.icon:hover {
    background-color: lightgray;
    cursor: pointer;
}
</style>