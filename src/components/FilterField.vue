<template>
    <div class="filter-field">
        <div class="drop-check-box">
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
    </div>
</template>

<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'; 

export default {
    props: ['laboratories', 'searchResultText'],
    emits: ['changeLaboratories'],
    data(){
        return {
            selectLaboratories: this.laboratories,
            isVisibleCheckBox: false
        };
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
    display: flex;
    position: fixed;
    background-color: white;
}
.drop-check-box__btn {
    display: flex;
    align-items: center;
    background-color: lightgrey;
}

.drop-check-box__boxes {
    display: flex;
    flex-direction: column;
    background-color: lightgrey;
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
}
</style>
