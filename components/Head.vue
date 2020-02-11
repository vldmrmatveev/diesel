<template lang="pug">
	v-container(:fluid="true")
		v-row
			v-col(cols="12" xl="6")
				v-card.p-4.mb-5(:elevation="6" min-width="100%")
					v-row
						v-col(cols="12" md="5" xl="3")
							.d-flex.align-center.justify-center.image_container
								v-img(src="man.png" :contain="true")
						v-col(cols="12" md="7" xl="9" )
							.d-flex.flex-column.justify-space-between.card_text.align-center
								v-card-text.text-center
									p ФГБОУ ВO
										br
										| «Севастопольский государственный университет»
										br
										| Институт кораблестроения и морского транспорта
										br
										| Кафедра Энергоустановок морских судов и сооружений
								v-card-title.headline.justify-center
									.text-center Расчет
										br
										| судового двигателя
										br
										| внутреннего сгорания
								v-card-text.text-center.mt-5.caption
									p ПО предназначено для дипломного проектирования
										br
										| для студентов направления подготовки
										br
										| 26.05.06 «Эксплуатация судовых энергетических установок»
										br
										| очной  и заочной форм обучения
								v-card-text.text-center.caption
									p Автор
										br
										| Очеретяный В.А.
			v-col(cols="12" xl="6")
				v-card.p-4.mb-5(:elevation="6" min-width="100%")
					v-row
						v-col(cols="12").d-flex.flex-column.justify-space-between.card_text.align-start.pl-6.pr-6
							v-card-text.pb-2.pt-2 Настоящая программа является N-ной версией расчета судового двигателя внутреннего сгорания. Первая версия была разработана Мукониным М.В. и Мукониным А.М. В 1985…1986 гг. Она была реализована в операционной системе ЕС 1035 и была написана на алгоритмическом языке "FORTRAN". ЭВМ ЕС 1035 занимала помещение площадью 120 кв.м. Программа обеспечивала общение с пользователем в пакетном режиме. Результаты расчета можно было получить в виде твердной копии на рулонной бумаге шириной 0,5 м.
							v-card-text.pb-2.pt-2 Вторая, исправленная и дополненная версия программы разработана Капустиным В.В. и Очеретяным В.А. в 1996…1997 гг. Она была реализована в операционной системе DOS в пакете "Turbo Basic". Одновременно была получена возможность формирования графических результатов динамического расчета в пакете Microsoft Offise - Excel. В 1998 году в пакет дополнен диаграммами векторной и износа.
							v-card-text.pb-2.pt-2 Третья версия программа значительно расширяет возможности расчета ДВС. Она работает в операционной системе Windows, и реализована в пакете Excel+VBA. Получена возможность формирования двух вариантов расчета с дальнейшим анализом в табличном и графических видах. Программа имеет понятный и удобный интерфейс. Ввод исходных данных очень несложен. Дополнительные комментарии (введеные как примечания в соответствующих ячейках) упрощают общение с программой. Графические результаты дополнены индикаторной диаграммой. Программа позволяет выполнять расчет рядных и V- образных ДВС, двухтактных и четырехтактных. Для изучения подробностей работы с программой изданы методические указания:
							ul.caption.mb-6.ml-3
								li Добавлен расчет температуры газов за турбиной (декабрь 2006)
								li Изменена структура пакета, обеспечивающая упрощения технологии расчета.
								li Расширены диапазоны на вводимые параметры (2009).
								li Сокращен перечень выводимых диаграмм (2010).
							v-card-text.pb-2.pt-2.d-xl-none При использовании ссылаться на работы:
							ol.caption.mb-6.ml-3.d-xl-none
								li Расчет судового двигателя внутреннего сгорания [Электронный ресурс]. – Прикладная прогр. Разр. Очеретяный В.А. (2,2 Мб). – Севастополь.: Выч. центр каф. ЭМСС СевГУ, 2001-2015.
								li Расчеты судового дизеля на ЭВМ. Расчет рабочего процесса. Динамический расчет. Методические указания к выполнению курсового проекта и разделов 2.1 и 2.2 дипломного проекта для студентов всех форм обучения специальности «Эксплуатация судовых энергетических установок»/ сост. В.А.Очеретяный, Г.В.Гоголев. - Севастополь: ФГБОУ ВО СГУ, 2015. - 12с.
			v-col(cols="12")
				v-card.p-4(:elevation="6" min-width="100%")
					v-container(:fluid="true")
						v-row.align-center
							v-col(cols="12" md="5")
								h2.mb-4.pl-4 Прежде чем начать, необходимо ввести ФИО и группу
								v-form(ref="form" v-model="valid" :lazy-validation="false").pl-4
									v-text-field(v-model="name" label='ФИО' name="name" required placeholder="Фамилия, И.О." outlined color="#00897B" :rules="nameRules")
									v-text-field(v-model="group" :rules="nameRules" label='Группа' required placeholder="ЭУ-52" outlined color="#00897B")
									v-text-field(v-model="email" :rules="emailRules" label='Email' required placeholder="example@mail.com" outlined color="#00897B")
									v-btn(color="#00897B" :disabled="!valid" :large="true" @click="validateBtn").theme--light.v-btn.custom-btn.custom-btn__link Продолжить
							v-col(cols="12" offset-md="2"  md="3")
								.d-flex.align-center.justify-center.image_container
									v-img(src="man_engine.png" :contain="true")
									//v-show="table && valid"
									// && $vuetify.goTo('#maincontainer')
</template>
<script>
import { mapMutations } from 'vuex'
export default {
	data() {
		return {
			//table: false,
			valid: false,
			//name: '',
			//group: '',
			email: '',
			nameRules: [
				(v) => !!v || 'Пустое поле',
				(v) => (v && v.length >= 3) || 'Слишком короткое имя'
			],
			emailRules: [
				(v) => !!v || 'Пустое поле',
				(v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный email'
			]
		}
	},
	computed: {
		table () {
			return this.$store.state.table
		},
		name: {
			get() {
				return this.$store.state.name;
			},
			set(value) {
				this.$store.commit('updateMessage', value)
			}
		},
		group: {
			get() {
				return this.$store.state.group;
			},
			set(value) {
				this.$store.commit('updateGroup', value)
			}
		}
	},
		methods: {
		...mapMutations({
			validateBtn: 'validate'
		})
		/*validateBtn() {
			console.log(this.$store.state.table);
			//this.$store.state.table = !this.$store.state.table
		}*/
	},
}
</script>