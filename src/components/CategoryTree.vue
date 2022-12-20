<template>
    <ul v-if="tree.length>0">
        <li v-for="el in tree" :key="el.category['id_clr']">
            <p>{{el.category['name_clr']}}</p>
            <CategoryTree :tree="el.children"/>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'CategoryTree',
    props: ['tree'],
    emits:  ['categoryClick'],
}
</script>

<style scoped>

</style>