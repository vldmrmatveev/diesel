<template lang="pug">
	v-app(dark)
		v-app-bar(:clipped-left='clipped' fixed app).d-print-none
			v-toolbar-title(v-text='title')
			v-spacer
			v-btn(text icon @click="$vuetify.theme.dark = !$vuetify.theme.dark")
				v-icon(v-if="$vuetify.theme.dark") mdi-white-balance-sunny
				v-icon(v-else) mdi-weather-night
		v-content
			nuxt
		v-footer(:fixed='fixed' app).d-print-none
			span © {{date}}, СевГУ
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
			fixed: false,
			date: (new Date()).getFullYear(),
      items: [
        {
          icon: 'mdi-apps',
          title: 'Главная',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Расчет СДВС'
    }
  }
}
</script>
