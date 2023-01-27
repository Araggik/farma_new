<template>
    <div class="modal-layout">
        <form class="form">
            <div class="form__head">
                {{ formName }}
            </div>

            <div class="form__field overflow-ellipsis">

                <label for='labResearchField' class="form__field-label">
                    Основная лаборатория:
                </label>
                
                <select id="labResearchField" @click="loadCategories" 
                v-model="changedData['current_laboratory']" class="laboratory-select">
                        <option v-for="lab in laboratories" :key="lab['id_labs']"
                        :value="lab['id_labs']">
                            {{ lab['name_lab'] }}
                        </option>               
                </select>
                            
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
    props: ['api'],
    emits: ['closeSelectForm'],
    data(){
        return {
            formName: 'Изменение исследований',
            laboratories: [],
            changedData: {
                'current_laboratory': 1
            }
        }
    },
    methods: {
        async loadLaboratories(){
            const laboratoryResponse = await this.api.get('laboratories?order=name_lab.asc');

            this.laboratories = laboratoryResponse.data;
        },
        onButtonClick(isEdited){
            if (isEdited) {
                this.$emit('closeSelectForm', this.changedData);
            } else {
                this.$emit('closeSelectForm', null);
            }
        }
    },
    created(){
        this.loadLaboratories();
    }
}
</script>

<style>
.laboratory-select {
    width: 100%;
}
</style>