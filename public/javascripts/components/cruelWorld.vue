<template>
    <div class="cruel">
        Cruel hhhh
        <span></span>
    </div>
</template>

<script>
module.exports = {
    name: "cruel",
    props: ["user"],
    data () {
        return {
            who: "World",
        }
    },
}
</script>

<style scoped>
.cruel {
    color: green;
}
</style>