<template>
  <ul v-if="pager.pages && pager.pages.length" class="pagination" :style="ulStyles">
    <li class="page-item first" :class="{ disabled: pager.currentPage === 1 }" :style="liStyles">
      <a class="page-link" @click="setPage(1)" :style="aStyles">{{ labels.first }}</a>
    </li>
    <li class="page-item previous" :class="{ disabled: pager.currentPage === 1 }" :style="liStyles">
      <a class="page-link" @click="setPage(pager.currentPage - 1)" :style="aStyles">{{
        labels.previous
      }}</a>
    </li>
    <li
      v-for="page in pager.pages"
      :key="page"
      class="page-item page-number"
      :class="{ active: pager.currentPage === page }"
      :style="liStyles"
    >
      <a class="page-link" @click="setPage(page)" :style="aStyles">{{ page }}</a>
    </li>
    <li
      class="page-item next"
      :class="{ disabled: pager.currentPage === pager.totalPages }"
      :style="liStyles"
    >
      <a class="page-link" @click="setPage(pager.currentPage + 1)" :style="aStyles">{{
        labels.next
      }}</a>
    </li>
    <li
      class="page-item last"
      :class="{ disabled: pager.currentPage === pager.totalPages }"
      :style="liStyles"
    >
      <a class="page-link" @click="setPage(pager.totalPages)" :style="aStyles">{{ labels.last }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
import paginate from './paginate'

const defaultStyles = {
  ul: {
    margin: 0,
    padding: 0,
    display: 'inline-block'
  },
  li: {
    listStyle: 'none',
    display: 'inline',
    textAlign: 'center'
  },
  a: {
    cursor: 'pointer',
    padding: '6px 12px',
    display: 'block',
    float: 'left'
  }
}

const { items, initialPage, pageSize, maxPages, labels, styles, disableDefaultStyles } =
  defineProps({
    items: {
      type: Array,
      required: true
    },
    initialPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    maxPages: {
      type: Number,
      default: 10
    },
    labels: {
      type: Object,
      default: () => ({
        first: 'First',
        last: 'Last',
        previous: 'Previous',
        next: 'Next'
      })
    },
    styles: {
      type: Object
    },
    disableDefaultStyles: {
      type: Boolean,
      default: false
    }
  })

const emit = defineEmits<{
  (event: 'changePage', value: string): void
}>()

const pager = ref(paginate(items.length, initialPage, pageSize, maxPages))
const ulStyles = ref({})
const liStyles = ref({})
const aStyles = ref({})

const initialize = () => {
  if (!disableDefaultStyles) {
    ulStyles.value = defaultStyles.ul
    liStyles.value = defaultStyles.li
    aStyles.value = defaultStyles.a
  }

  if (styles) {
    ulStyles.value = { ...ulStyles.value, ...styles.ul }
    liStyles.value = { ...liStyles.value, ...styles.li }
    aStyles.value = { ...aStyles.value, ...styles.a }
  }

  setPage(initialPage)
}

const setPage = (page: number) => {
  const pagerData = paginate(items.length, page, pageSize, maxPages)

  const pageOfItems = items.slice(pagerData.startIndex, pagerData.endIndex + 1).toString()

  pager.value = pagerData
  emit('changePage', pageOfItems)
}

watch(
  () => items,
  () => setPage(initialPage)
)

initialize()
</script>
