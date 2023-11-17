<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useImagePath } from '@/utils/useImagePath.js'
import { useWindowSize } from '@vueuse/core'

const sliderList = [
    {
        name: 'Connie Springer',
        japaneseName: 'コニー・スプリンガー',
        height: '158cm',
        weight: '58kg',
        birth: '835-5-2',
        image: 'connie.png'
    },
    {
        name: 'Zoë Hange',
        japaneseName: 'ハンジ・ゾエ',
        height: '170cm',
        weight: '60kg',
        birth: '9-5',
        image: 'hans.png'
    },
    {
        name: 'Levi',
        japaneseName: 'リヴァイ',
        height: '160cm',
        weight: '65kg',
        birth: '12-25',
        image: 'levi.png'
    },
    {
        name: 'Armin Arlert',
        japaneseName: 'アルミン・アルレルト',
        height: '163cm',
        weight: '55kg',
        birth: '835-11-3',
        image: 'armin.png'
    },
    {
        name: 'Eren Yeager',
        japaneseName: 'エレン・イェーガー',
        height: '170cm',
        weight: '63kg',
        birth: '835-3-30',
        image: 'eren.png'
    },
    {
        name: 'Mikasa Ackerman',
        japaneseName: 'ミカサ・アッカーマン',
        height: '160cm',
        weight: '50kg',
        birth: '835-2-10',
        image: 'mikasa.png'
    },
    {
        name: 'Erwin Smith',
        japaneseName: 'エルヴィン・スミス',
        height: '188cm',
        weight: '92kg',
        birth: '10-14',
        image: 'erwin.png'
    },
   
    {
        name: 'Sasha Blouse',
        japaneseName: 'サシャ・ブラウス',
        height: '168cm',
        weight: '55kg',
        birth: '7-26',
        image: 'sasha.png'
    },
    {
        name: 'Jean Kirschstein',
        japaneseName: 'ジャン・キルシュタイン',
        height: '175cm',
        weight: '65kg',
        birth: '835-4-7',
        image: 'jean.png'
    },
]
const activeIndex = ref(7)
const slideItemWidth = ref(0)
const offset = ref(0)
const slideList = ref('')
const isFlip = ref(false)
const { width: screenWidth } = useWindowSize()

const getSlideItemWidth = () => {
    const sliderItem = document.querySelector('.slider-item')
    if (sliderItem) {
      const styles = window.getComputedStyle(sliderItem);
      const marginLeft = parseFloat(styles.getPropertyValue('margin-left'))
      const marginRight = parseFloat(styles.getPropertyValue('margin-right'))
      slideItemWidth.value = sliderItem.clientWidth + marginLeft + marginRight
    }
}

const cloneSlide = computed(() => {
    const prepend = sliderList.slice(-3)
    const append = sliderList.slice(0,3)
    return [...prepend,...sliderList,...append]
})

const activeContent = computed(() => {
    const activeSlide =  cloneSlide.value[activeIndex.value]
    const activeData = filterData(activeSlide)
    return activeData
})
const preContent = computed(() => {
    const preSlide = cloneSlide.value[activeIndex.value - 1]
    const preData = filterData(preSlide)
    return preData
})
const nextContent = computed(() => {
    const nextSlide = cloneSlide.value[activeIndex.value + 1]
    const nextData = filterData(nextSlide)
    return nextData
})

const filterData = (index) => {
    const data = Object.keys(index)
            .filter(key => key !== 'image')
            .reduce((result,key) => {
                result[key] = index[key]
                return result
            },{})
    return data
}
const moveSlide = (direction) => {
    activeIndex.value += direction > 0 ? 1 : -1
    if (activeIndex.value > cloneSlide.value.length) {
      activeIndex.value = 7
    }
    offset.value += -direction * slideItemWidth.value 
    isFlip.value = true
}

const setRotateDeg = (index) => {
    const num = 1
    const deg = (activeIndex.value + num) * 2
    if (index !== activeIndex.value) {
        const rotateDeg = index > activeIndex.value ? deg : -deg;
        return `rotate(${rotateDeg}deg)`;
    } else {
        return `translateY(-10%) scale(1.3)`;
    }
}
watch(screenWidth, () => {
    if(screenWidth.value){
        getSlideItemWidth()
    }
})

onMounted(() => {
    getSlideItemWidth()
})
</script>
<template>
    <div class="slider">
        <h3 class="slider-name">
            <span>{{ activeContent.name }}</span>
            <span>{{ activeContent.japaneseName }}</span>
        </h3>
        <ul class="slider-list" :style="{transform: `translateX(${offset}px)`}">
            <li 
            v-for="(slideItem,slideIndex) in cloneSlide" 
            :key="slideIndex"
            class="slider-item"
            :class="{ active: slideIndex === activeIndex }"
            :style="{ transform: setRotateDeg(slideIndex) }"
            >
                <img 
                :src="useImagePath(slideItem.image)" 
                :alt="slideItem.name"
                draggable="false"
                >
            </li>
        </ul>
        <div class="slider-content" :class="{show: isFlip}">
            <div class="pre" >
                <span>birth | {{ preContent.birth }}</span>
                <span>height | {{ preContent.height }}</span>
                <span>weight | {{ preContent.weight }}</span>
            </div>
            <div class="active">
                <span>birth | {{ activeContent.birth }}</span>
                <span>height | {{ activeContent.height }}</span>
                <span>weight | {{ activeContent.weight }}</span>
            </div>
        </div>
        <div class="slider-btns">
            <button class="prev-btn" @click="moveSlide(1)"></button>
            <button class="next-btn" @click="moveSlide(-1)"></button>
        </div>
    </div>
  
</template>
<style lang="scss">
    .slider{
        position: relative;
        overflow: hidden;
        &-name{
            position: absolute;
            inset: 0;
            line-height: 1;
            color: #ffffff86;
            text-align: center;
            span{
                display: block;
                &:first-child{
                    font-size: 10vw;
                }
                &:last-child{
                    font-size: 7vw;
                }
            }
        }
        &-list{
            display: flex;
            justify-content: center;
            padding:10% 0 0;
            margin: 10% 0 0;
            list-style: none;
            transition: all 1.5s;
        }
        &-item{
            flex: calc(100% / 3) 0 0;
            max-width: 407px;
            max-height: 750px;
            margin: 0 5%;
            opacity: .5;
            transform-origin: bottom center;
            transition: all 2s;
            &.active{
                transform: translateY(-10%) scale(1.3);
                opacity: 1;
            }
            
            img{
                width: 100%;
                vertical-align: middle;
            }
        }
        &-content{
            position: relative;
            margin: -40px 0 20px;
            height: 40px;
            font-size: 24px;
            text-align: center;
            color: #fff;
            transform-style: preserve-3d;
            transform-origin: 0%, 0%;
            
            span{
                margin: 0 15px;
            }
            .pre{
                position: absolute;
                top: 0;
                opacity: 1;
                transition: all .8s ease-in;
                transform: rotateX(0deg);
            }
            .active{
                position: absolute;
                top: -20px;
                opacity: 0;
                transition: all .8s ease-in;
                transform: rotateX(90deg);
            }
            &.show{
                .pre{
                    top: 100px;
                    opacity: 0;
                    transform: rotateX(90deg);
                }
                .active{
                    top: 0;
                    opacity: 1;
                    transform: rotateX(0deg);
                }
            }
            
        }
        &-btns{
            position: absolute;
            top: 55%;
            right: 0;
            left: 0;
            display: flex;
            justify-content: space-between;
            width: 40%;
            margin: auto;

            .next-btn,
            .prev-btn{
                position: relative;
                width: 52px;
                height: 72px;
                border: none;
                background: none;
                cursor: pointer;
                &::before{
                    content: '';
                    position: absolute;
                    inset: 0;
                    margin: auto;
                    width: 52px;
                    height: 72px;
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                }
            }

            .next-btn{
                &::before{
                    background-image: url('../assets/images/arrow_next.png');
                }
            }
            .prev-btn{
                &::before{
                    background-image: url('../assets/images/arrow_pre.png');
                }
            }
        }
    }
</style>