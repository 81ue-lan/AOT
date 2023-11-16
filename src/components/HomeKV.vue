<script setup>
    import BaseSlider from '@/components/BaseSlider.vue'
</script>
<template>
    <div class="section-kv">
        <h1 class="logo">
            <img src="../assets/images/logo.png" alt="進撃の巨人" draggable="false">
        </h1>
        <div class="kv">
            <BaseSlider/>
        </div>
    </div>
</template>
<style lang="scss">
    .section-kv{
        position: relative;
        overflow: hidden;
        .logo{
            width: 250px;
            margin: 20px 0 0 20px;
            img{
                width: 100%;
            }
        }
        .kv{
        }
    }
</style>