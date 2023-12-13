<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useImagePath } from '@/utils/useImagePath.js'
import { useWindowSize } from '@vueuse/core'

const sliderList = [
    {
        name: 'Eren Yeager',
        japaneseName: 'エレン・イェーガー',
        height: '170cm',
        weight: '63kg',
        image: 'eren.png'
    },
    {
        name: 'Mikasa Ackerman',
        japaneseName: 'ミカサ・アッカーマン',
        height: '160cm',
        weight: '50kg',
        image: 'mikasa.png'
    },
    {
        name: 'Connie Springer',
        japaneseName: 'コニー・スプリンガー',
        height: '158cm',
        weight: '58kg',
        image: 'connie.png'
    },
    {
        name: 'Zoë Hange',
        japaneseName: 'ハンジ・ゾエ',
        height: '170cm',
        weight: '60kg',
        image: 'hans.png'
    },
    {
        name: 'Levi',
        japaneseName: 'リヴァイ',
        height: '160cm',
        weight: '65kg',
        image: 'levi.png'
    },
    {
        name: 'Erwin Smith',
        japaneseName: 'エルヴィン・スミス',
        height: '188cm',
        weight: '92kg',
        image: 'erwin.png'
    },  
    {
        name: 'Sasha Blouse',
        japaneseName: 'サシャ・ブラウス',
        height: '168cm',
        weight: '55kg',
        image: 'sasha.png'
    },
    {
        name: 'Jean Kirschstein',
        japaneseName: 'ジャン・キルシュタイン',
        height: '175cm',
        weight: '65kg',
        image: 'jean.png'
    },
    {
        name: 'Armin Arlert',
        japaneseName: 'アルミン・アルレルト',
        height: '163cm',
        weight: '55kg',
        image: 'armin.png'
    },
]
const activeIndex = ref(3)
const slideItemWidth = ref(0)
const offset = ref(0)
const offsetY = ref(0)
const slideList = ref('')
const isUpdate = ref(false)
const isTransitionEnd = ref(true)
const { width: screenWidth } = useWindowSize()

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

const calculateOffset = () => {
  offset.value = -(
    slideItemWidth.value -
    (slideList.value.offsetWidth - slideItemWidth.value) / 2 +
    slideItemWidth.value * (activeIndex.value - 1)
  )
  return slideList.value.style.transform = `translateX(${ offset.value }px)`
}

const filterData = (index) => {
    const data = Object.keys(index)
            .filter(key => key !== 'image')
            .reduce((result,key) => {
                result[key] = index[key]
                return result
            },{})
    return data
}
const getSlideItemWidth = () => {
    const sliderItem = document.querySelector('.slider-item')
    if (sliderItem) {
      const styles = window.getComputedStyle(sliderItem);
      const marginLeft = parseFloat(styles.getPropertyValue('margin-left'))
      const marginRight = parseFloat(styles.getPropertyValue('margin-right'))
      slideItemWidth.value = sliderItem.clientWidth + marginLeft + marginRight
    }
}

const init = () => {
    getSlideItemWidth()
    calculateOffset()
}
const moveSlide = (direction) => {
    if(!isTransitionEnd.value){
        return
    }
    isTransitionEnd.value = false
    stopAutoPlay()
    activeIndex.value += direction > 0 ? 1 : -1
    startAutoPlay()
    offset.value += -direction * slideItemWidth.value
    isUpdate.value = true

    animate()
    slideList.value.style.transform = `translateX(${ offset.value }px)`
}
const updateSliderPosition = () => {
    if(isTransitionEnd.value){
        return
    }
    isTransitionEnd.value = true
    
    if (activeIndex.value > sliderList.length + 2) {
        activeIndex.value = 3
    }
    if (activeIndex.value < 3) {
        activeIndex.value = sliderList.length + 2
    }
    isUpdate.value = false
    calculateOffset()
}

let autoPlay = {}
const startAutoPlay = () => {
  autoPlay = setInterval(() => {
    moveSlide(1)
  }, 2500)
}
const stopAutoPlay = () => {
  clearInterval(autoPlay)
}

// 文字動畫
const text1 = ref(null);
const text2 = ref(null);

const morphTime = 1
const cooldownTime = 0.3
let morph = 0
let cooldown = cooldownTime
let time = new Date()

const doMorph = () => {
    morph -= cooldown
    cooldown = 0

    let fraction = morph / morphTime

    if (fraction > 1) {
        cooldown = cooldownTime
        fraction = 1
    }
    setMorph(fraction)
}
const setMorph = (fraction) => {
    const applyMorph = (ele, fraction) => {
        ele.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
        ele.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`
    }
    applyMorph(text2.value, fraction)
    applyMorph(text1.value, 1 - fraction)
}
const doCooldown = () => {
    morph = 0;
    text2.value.style.filter = ""
    text2.value.style.opacity = "100%"
    text1.value.style.filter = ""
    text1.value.style.opacity = "0%"
}
const animate = () => {
    requestAnimationFrame(animate)
    let newTime = new Date();
    let dt = (newTime - time) / 3500;
    time = newTime;

    cooldown -= dt;
      if (cooldown <= 0 && isUpdate.value) {
        doMorph()
      } else if(!isUpdate.value){
        doCooldown()
      }
}

watch(screenWidth, () => {
    if(screenWidth.value){
        init()
    }
})

onMounted(() => {
    init()
    animate()
    startAutoPlay()
})
</script>
<template>
    <div class="slider">
        <div class="slider-name-wrap">
            <h3 class="slider-name" ref="text1">
                <span>{{ preContent.name }}</span>
                <span>{{ preContent.japaneseName }}</span>
            </h3>
            <h3 class="slider-name" ref="text2">
                <span>{{ activeContent.name }}</span>
                <span>{{ activeContent.japaneseName }}</span>
            </h3>
        </div>
        <svg id="filter">
            <defs>
                <filter id="threshold">
                    <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                                            0 1 0 0 0
                                            0 0 1 0 0
                                            0 0 0 255 -140" />
                </filter>
            </defs>
        </svg>
        <ul 
         class="slider-list" 
         ref="slideList"
         :style="{'transition': isTransitionEnd ? 'none' : 'all .8s ease-in-out'}"
         @transitionend="updateSliderPosition"
         @mouseenter="stopAutoPlay"
         @mouseleave="startAutoPlay"
         >
            <li 
            v-for="(slideItem,slideIndex) in cloneSlide" 
            :key="slideIndex"
            class="slider-item"
            :class="{ active: slideIndex === activeIndex ||  slideIndex === activeIndex + 9 ||  slideIndex === activeIndex - 9 }"
            >
                <img 
                :src="useImagePath(slideItem.image)" 
                :alt="slideItem.name"
                draggable="false"
                >
                <Transition name="fade">
                    <div class="slider-content-list"
                    v-show="slideIndex === activeIndex ||  slideIndex === activeIndex + 9 ||  slideIndex === activeIndex - 9"
                    >
                        <span>height | {{ slideItem.height }}</span>
                        <span>weight | {{ slideItem.weight }}</span>
                    </div>
                 </Transition>
            </li>
        </ul>
        <div class="slider-btns">
            <button class="prev-btn" @click="moveSlide(-1)"></button>
            <button class="next-btn" @click="moveSlide(1)"></button>
        </div>
    </div>
  
</template>
<style lang="scss">
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s ease-in-out;
        transition-duration: 1.5s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    .slider{
        position: relative;
        overflow: hidden;
        &-name-wrap{
            filter: url(#threshold) blur(0.6px);
            opacity: .6;
        }
        &-name{
            position: absolute;
            inset: 0;
            line-height: 1;
            color: #ffffff;
            text-align: center;
            
            span{
                display: block;
                &:first-child{
                    font-size: 130px;
                }
                &:last-child{
                    font-size: 80px;
                }
            }
        }
        &-list{
            display: flex;
            padding:10% 0 0;
            list-style: none;
        }
        &-item{
            flex: calc(100% / 3) 0 0;
            max-width: 407px;
            max-height: 750px;
            margin: 0 5%;
            opacity: .5;
            transform-origin: bottom center;
            transition: all 1s ease;
            &.active{
                opacity: 1;
                transform: scale(1.3);
                transition: all 1s ease;
                transition-delay: .2s;
            }
            
            img{
                width: 100%;
                vertical-align: middle;
            }
        }
        &-content-list{
            width: fit-content;
            margin: auto;
            font-size: 1vw;
            color: #fff;
            span{
                margin: 0 .5rem;
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
                    width: 100%;
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
    @media (max-width: 768px){
        .slider{
            &-name{
                span{
                &:first-child{
                    font-size: 100px;
                }
                &:last-child{
                    font-size: 80px;
                }
            }
            }
            &-list{
            }
            &-btns{
                .next-btn,
                .prev-btn{
                    width: 20%;
                }
            }
        }
    }
    @media (max-width: 768px){
        .slider{

        }
    }
</style>