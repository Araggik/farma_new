<template>
    <div class="modal-layout">
        <p>{{ researchData['research']['name_lr'] }}</p>
    </div>
</template>

<script>
export default {
    props: ['researchData']
}
</script>

<style scoped>
.modal-layout {
    position: fixed;
    z-index: 1;
    background-color: rgba(211, 211, 211, 0.5);
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
</style>