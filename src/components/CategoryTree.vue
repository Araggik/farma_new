<template>
    <ul v-if="tree.length>0">
        <li v-for="el in tree" :key="el.category['id_clr']">
            <p @click="$emit('categoryClick', el.category)">
                {{el.category['name_clr']}}
            </p>
            <CategoryTree @category-click="(category)=>$emit('categoryClick', category)" :tree="el.children"/>
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