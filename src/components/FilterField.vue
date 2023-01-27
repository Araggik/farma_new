<template>
    <div class="filter-field">
        <div class="check-box">
            <input @change="$emit('changeNotActive')" type="checkbox" id="naCheckBox"
            class="check-box__input">

            <label for="naCheckBox" class="check-box__label">Показать удаленные</label>
        </div>
        <div v-if="searchResultText ==''" class="drop-check-box">
            <button class="drop-check-box__btn" @click="onBoxClick">
                <p>
                  Выберите лаборатории 
                </p>
                <ChevronRight :class="{'rotated': isVisibleCheckBox}"/>
            </button>
            <div v-if="isVisibleCheckBox" class="drop-check-box__boxes">
                <div v-for="element in laboratories" :key="element['id_labs']" class="drop-check-box__item">
                    <input class="drop-check-box__input" type="checkbox" 
                    :value="element" v-model="selectLaboratories"
                    :id="'labCheckBox'+element['id_labs']">

                    <label :for="'labCheckBox'+element['id_labs']">
                        {{ element['name_lab'] }}
                    </label>
                </div>             
            </div>
        </div>
        <div class="search-result-text">
            {{ searchResultText }}
        </div>
        <div v-if="isSelectResearches" class="select-researches-buttons">
            <button @click="$emit('editSelectResearches', true)">
                Изменить выбранное
            </button>

            <button @click="$emit('editSelectResearches', false)">
                Отмена
            </button>
        </div>
    </div>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'; 

export default {
    props: ['laboratories', 'selectLabs', 'searchResultText', 'isSelectResearches'],
    emits: ['changeLaboratories', 'changeNotActive', 'editSelectResearches'],
    data(){
        return {
            selectLaboratories: [],
            isVisibleCheckBox: false,
        };
    },
    watch: {
        selectLabs(newValue){
            this.selectLaboratories = newValue;
        }
    }, 
    methods: {
        onBoxClick(){
            this.isVisibleCheckBox = !this.isVisibleCheckBox;
            if (!this.isVisibleCheckBox){
                this.$emit('changeLaboratories', this.selectLaboratories);
            }
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
.filter-field {
    flex: 7;
    display: flex;
    background-color: lightgray;
    align-content: baseline;
    /* border: 2px solid black; */
}

.check-box {
    display: flex;
    align-items: center;
    padding: 2px;
}

.check-box__input:hover {
    cursor: pointer;
}

.check-box__label:hover {
    cursor: pointer;
}

.drop-check-box {
    padding: 2px;
}

.drop-check-box__btn {
    display: flex;
    align-items: center;
    width: 12rem;
    height: 100%;
}

.drop-check-box__btn:hover {
    cursor: pointer;
}

.drop-check-box__boxes {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: lightgray;
    border: 1px solid black;
    width: 12rem;
}

.drop-check-box__item { 
    display: flex;
    align-items: center;
}

.drop-check-box__input {
    height: 1.5em;
    width: 1.5em;
}

.search-result-text {
    font-weight: bolder;
    display: flex;
    align-items: center;
    padding: 2px;
}

.select-researches-buttons {
    display: flex;
    justify-content: space-between;
}
</style>
