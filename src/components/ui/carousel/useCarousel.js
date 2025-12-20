import { createInjectionState } from '@vueuse/core'
import emblaCarouselVue from 'embla-carousel-vue'
import { onMounted, ref } from 'vue'

const [useProvideCarousel, useInjectCarousel] = createInjectionState(
  ({ opts, orientation, plugins }, emits) => {
    const [emblaNode, emblaApi] = emblaCarouselVue(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    )

    const canScrollPrev = ref(false)
    const canScrollNext = ref(false)

    const scrollPrev = () => {
      if (emblaApi.value) emblaApi.value.scrollPrev()
    }
    const scrollNext = () => {
      if (emblaApi.value) emblaApi.value.scrollNext()
    }

    const onSelect = (api) => {
      canScrollPrev.value = api.canScrollPrev()
      canScrollNext.value = api.canScrollNext()
    }

    onMounted(() => {
      if (!emblaApi.value) return

      emblaApi.value.on('init', onSelect)
      emblaApi.value.on('reInit', onSelect)
      emblaApi.value.on('select', onSelect)

      emits('init-api', emblaApi.value)
    })

    return {
      carouselRef: emblaNode,
      api: emblaApi,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      orientation,
    }
  },
)

const useCarousel = useInjectCarousel

export { useProvideCarousel, useInjectCarousel, useCarousel }
