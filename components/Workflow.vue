<template lang="pug">
div
	//v-container(:fluid="true" v-show="table")#maincontainer
	v-container(:fluid="true")#maincontainer
		v-card.p-4(:elevation="6" min-width="100%")
			v-row
				v-col(cols="12").d-flex.flex-column.justify-space-between.card_text.align-start.pl-6.pr-6
					h2.text-center.pl-3 Расчет рабочего процесса
					v-container(:fluid="true")
						v-form(ref="form" :lazy-validation="false")
							v-row
								v-col(cols="12" md="6")
									h4.mb-6 Основные параметры
									v-text-field(v-model="engineName" label='Тип двигателя' required placeholder="7L 58/64" outlined color="#00897B" hint="Введите марку дизеля").mb-2
									v-text-field(v-model="enginePower" label='Мощность двигателя, N' required placeholder="9800" suffix="кВт" outlined color="#00897B" hint="Необходимо ввести суммарную (аггрегатную) мощность ДВС" type='number').mb-2
									v-text-field(v-model="engineRotationFrequency" label='Частота вращения коленчатого вала, n' required placeholder="428" suffix="об/мин" outlined color="#00897B" type='number').mb-2
									v-text-field(v-model="enginePistonStroke" label='Ход поршня, s' required placeholder="640" suffix="мм" outlined color="#00897B" hint="Ввести в мм" type='number').mb-2
									v-text-field(v-model="engineCylinderDiameter" label='Диаметр цилиндра, D' required placeholder="580" suffix="мм" outlined color="#00897B" hint="Ввести в мм" type='number').mb-2
									v-select(v-model="selectCycle" outlined label="Тактность, ν" :items="['2', '4']" required color="#00897B" item-color="warning").mb-2
									v-select(v-model="engineBoostType" outlined label="Тип наддува" :items="['0', '1', '2', '3']" required color="#00897B" item-color="warning" hide-details).mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up")
										p.font-weight-light.caption.mb-0 1 - если N(турб) = N(комп)
											br
											| 2 - если N(турб) 	&#62; N(комп)
											br
											| 3 - если N(турб) &#60; N(комп)
											br
											| 0 - если двигатель без наддува
									v-text-field(v-model="engineCylinderNum" label='Число цилиндров, z' required placeholder="7" suffix="штук" outlined color="#00897B" type='number').mb-2
								v-col(cols="12" md="6")
									h4.mb-6 Параметры по температуре
									v-text-field(v-model="initialTemp" label='Температура окружающей среды, To' required disabled outlined color="#00897B").mb-2
										template(slot='append')
											span &#176;C
									v-text-field(label='Допускаемая температура сгорания, Tdop' v-model="initialCombustionTemperature" required disabled outlined color="#00897B" suffix="K" type='number').mb-2
									//Подогрев заряда от стенок цилиндра
									v-text-field(v-if="engineBoostType=='0'" label='Подогрев заряда от стенок цилиндра, δст' v-model="HeatedChargeFromCylinder" required placeholder="5" outlined color="#00897B" suffix="K" type='number').mb-2
									v-select(v-else-if="selectCycle=='2' && !engineBoostType=='0'" v-model="HeatedChargeFromCylinder" placeholder="5" outlined label="Подогрев заряда от стенок цилиндра, δст" :items="HeatedChargeFromCylinderOne" required color="#00897B" item-color="warning" suffix="K").mb-2
									v-select(v-else-if="selectCycle=='4' && !engineBoostType=='0'" v-model="HeatedChargeFromCylinder" outlined label="Подогрев заряда от стенок цилиндра, δст" :items="HeatedChargeFromCylinderTwo" required color="#00897B" item-color="warning" suffix="K" placeholder="15").mb-2
									v-select(v-else v-model="HeatedChargeFromCylinder" outlined label="Подогрев заряда от стенок цилиндра, δст" :items="HeatedChargeFromCylinderTwo" required disabled color="#00897B" item-color="warning" placeholder="Доступно после выбора тактности и типа наддува" suffix="K").mb-2
									v-text-field(v-model="temp1" label='Первое приближение температуры сгорания, Tz(1)' required placeholder="1800" suffix="К" outlined color="#00897B" hint="Для МОД - 1700...1900, для СОД и ВОД - 1800...2000" type='number').mb-2
									v-text-field(v-model="temp2" label='Температура остаточных газов, Tг' required placeholder="650" suffix="К" outlined color="#00897B" hint="Для ДВС с ГТН: МОД - 550...650; СОД - 650...800; ВОД - 750...900" type='number').mb-2
									v-text-field(v-model="temp3" label='Максимальное снижение температуры в охладителе наддувочного воздуха, δxmaxm' required placeholder="100" suffix="К" outlined color="#00897B" hint="Максимальное снижение температуры в охладителе наддувочного воздуха, δxmaxm; Для 2-х тактных с ГТН: 40...140; Для 4-х тактных с ГТН: 0...80" type='number').mb-2
									h4.mb-3.mt-5 Коэффициент избытка воздуха
									v-row
										v-col(cols="12")
											v-alert(text dense color='teal' border='left').mb-4
												p.font-weight-light.caption.mb-0 Диапазоны для ДВС с ГТН:
												ul
													li.caption
														span.font-weight-bold.cyan--text 2-х тактные
														span - 1.8-2.7
													li.caption
														span.font-weight-bold.cyan--text 4-х тактные
														span - 1.6-2.2
									v-row
										v-col(cols="12" md="6")
											v-text-field(v-model="AirRatioMin" label='Минимальное значение, αmin' hint="Минимальное значение, αmin" required placeholder="1,7" outlined color="#00897B" type='number').mb-2
										v-col(cols="12" md="6")
											v-text-field(v-model="AirRatioMax" label='Максимальное значение, αmax' hint="Максимальное значение, αmax" required placeholder="2,2" outlined color="#00897B" type='number').mb-2
							v-divider
							v-row.mt-5
								v-col(cols="12" md="6")
									h4.mb-6 Параметры по давлению
									v-text-field(v-model="environmentalPressure" label='Давление окружающей среды, Pо' required disabled outlined suffix="МПа" color="#00897B" type="number").mb-2
									v-text-field(v-model="headLossParamComputed" label='Потери напора в охладителе наддувочного воздуха, δpx' required  outlined suffix="МПа" color="#00897B" type="number" hide-details placeholder="0,0015").mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up").mb-6
										p.font-weight-light.caption.mb-0 Для ДВС с ГТН:
										ul
											li.caption
												span.font-weight-bold.cyan--text 2-х тактные
												span - 0.003 - 0.007
											li.caption
												span.font-weight-bold.cyan--text 4-х тактные
												span - 0.001 - 0.003
									v-text-field(v-model="CyclePressureMax" label='Максимально допустимое давление цикла, Pzmax' required outlined suffix="МПа" color="#00897B" placeholder="16" hide-details type='number').mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up").mb-6
										p.font-weight-light.caption.mb-0 Принимать целым и превышающим данным параметр в прототипе вашего ДВС или для:
										ul
											li.caption
												span.font-weight-bold.cyan--text МОД 
												span - 6-15.5 МПа
											li.caption
												span.font-weight-bold.cyan--text СОД 
												span - 8.15-18 МПа
											li.caption
												span.font-weight-bold.cyan--text ВОД 
												span - 9-20 МПа
									v-select(v-model="pressureBehindTheTurbineParam" placeholder="0,105" outlined label="Давление за турбиной, Pos" :items="pressureBehindTheTurbine" required color="#00897B" item-color="warning" suffix="МПа").mb-2
									//селекты выбора Давление наддува
									v-text-field(v-if="engineBoostType=='0'" v-model="BoostPressure" label='Давление наддува (начальное значение), Pk(1)' suffix="МПа" placeholder="0.2" required outlined color="#00897B").mb-2
									v-select(v-else-if="selectCycle=='2' && !engineBoostType=='0'" v-model="BoostPressure" placeholder="0.2" outlined label="Давление наддува (начальное значение), Pk(1)" :items="BoostPressureTwoStroke" required color="#00897B" item-color="warning" suffix="МПа").mb-2
									v-select(v-else-if="selectCycle=='4' && !engineBoostType=='0'" v-model="BoostPressure" placeholder="0.2" outlined label="Давление наддува (начальное значение), Pk(1)" :items="BoostPressureFourStroke" required color="#00897B" item-color="warning" suffix="МПа").mb-2
									v-select(v-else v-model="BoostPressure" placeholder="Доступно после выбора тактности и типа наддува" outlined label="Давление наддува (начальное значение), Pk(1)" :items="BoostPressureFourStroke" required color="#00897B" item-color="warning" suffix="МПа" disabled).mb-2
									// конец селектов
								v-col(cols="12" md="6")
									h4.mb-6 Параметры топлива
									v-btn(color="#00897B" :large="true" @click.stop="fuelDialog = true").theme--light.v-btn.custom-btn.custom-btn_fuel Выбрать марку топлива
									v-dialog(v-model="fuelDialog" min-width="300")
										v-card
											v-card-title.headline.mb-4.pt-6 Параметры топлива
											v-btn(icon @click='fuelDialog = false').dialog-close
												v-icon mdi-close
											v-data-table.elevation-1(v-model='fuelSelected' :headers='fuelHeaders' :items='fuelItems' :single-select='true' :items-per-page="15" item-key='name' show-select hide-default-footer)
									v-text-field(v-model="fuelNameComputed" label='Марка топлива (ISO 8217-2010)' required disabled outlined color="#00897B").mb-2
									v-text-field(v-model="fuelDensityComputed" label='Плотность, ρ15' suffix="кг/куб.м" required disabled outlined color="#00897B")
									v-text-field(v-model="sulfurContentComputed" label='Содержание серы, S' suffix="% масс" required disabled outlined color="#00897B")
									v-text-field(v-model="fuelWaterComputed" label='Содержание воды, W' suffix="% объем" required disabled outlined color="#00897B")
									v-text-field(v-model="AshContentComputed" label='Зольность, A' suffix="% масс" required disabled outlined color="#00897B")
									v-text-field(v-model="NetCalorificValue" label='Низшая теплота сгорания, Qн' suffix="кДж/кг" required disabled outlined color="#00897B")
							v-divider
							v-row.mt-5
								v-col(cols="12" md="6").mt-6
									v-text-field(v-model="compressionRatio" label='Степень сжатия, ε' required outlined color="#00897B" placeholder="12" hide-details type='number').mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up")
										p.font-weight-light.caption.mb-0 Диапазоны для ДВС с ГТН:
										ul
											li.caption
												span.font-weight-bold.cyan--text МОД 
												span - 11-17
											li.caption
												span.font-weight-bold.cyan--text СОД 
												span - 12-18
											li.caption
												span.font-weight-bold.cyan--text ВОД 
												span - 15-19
									v-text-field(v-model="lostStrokeRate" label='Доля потерянного хода поршня, Ψ' required outlined color="#00897B" placeholder="0,04" hide-details type='number').mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up")
										p.font-weight-light.caption.mb-0 Для 2-х тактных ДВС:
										ul
											li.caption
												span.font-weight-bold.cyan--text Для поперечно-щелевой схемы газообмена
												span - 0.22-0.254
											li.caption
												span.font-weight-bold.cyan--text Для петлевой
												span - 0.195-0.22
											li.caption
												span.font-weight-bold.cyan--text Для прямоточной 
												span - 0.02-0.13
								v-col(cols="12" md="6").mt-6
									v-text-field(v-model="pressureIncreaseParam" label='Степень повышения давления (начальное значение), λ' required outlined color="#00897B" placeholder="1,3" hide-details type='number').mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up").mb-9
										ul
											li.caption
												span.font-weight-bold.cyan--text МОД 
												span - 1.15-1.35
											li.caption
												span.font-weight-bold.cyan--text СОД 
												span - 1.3-1.5
											li.caption
												span.font-weight-bold.cyan--text ВОД 
												span - 1.4-1.6
									v-text-field(v-model="AirMolarWeight" label='Молярный вес воздуха, m' required suffix="моль/кг" outlined color="#00897B" disabled type="number").mb-2
									v-row
										v-col(cols="12" md="3")
											v-select(v-model="boostType" placeholder="1" outlined label="Тип продувки" :items="['0', '1']" required color="#00897B" item-color="warning").mb-2
										v-col(cols="12" md="9")
											v-alert(text dense color='teal' border='left' icon="mdi-arrow-left")
												p.font-weight-light.caption.mb-0 При прямоточных схемах продувки и контурных с управляевым выпуском значение - 1, во всех остальных случаях - 0
							v-divider
							v-row.mt-5
								v-col(cols="12")
									h4.mb-6 Параметры точности расчета
							v-row
								v-col(cols="12" md="3" sm="6")
									v-text-field(v-model="coefficientOfExcessAir" label='Шаг изменения коэффициента избытка воздуха, δα' required outlined color="#00897B" hint="Шаг изменения коэффициента избытка воздуха, δα - Без особых рекомендаций преподавателя вводить 0.1" type='number')
								v-col(cols="12" md="3" sm="6")
									v-text-field(v-model="coefficientOfExcessPressure" label='Шаг изменения степени повышения давления, δλ' required outlined color="#00897B" hint="Шаг изменения степени повышения давления, δλ - Без особых рекомендаций преподавателя вводить 0.05" type='number')
								v-col(cols="12" md="3" sm="6")
									v-text-field(v-model="CalculationErrorPressure" label='Погрешность расчета  по мощности, δNe' required outlined color="#00897B" hint="Погрешность расчета  по мощности, δNe - Без особых рекомендаций преподавателя вводить 0.5" type='number')
								v-col(cols="12" md="3" sm="6")
									v-text-field(v-model="CalculationError" label='Погрешность расчета, δ' required outlined color="#00897B" hint="Без особых рекомендаций преподавателя вводить 0.5" type='number').mb-2
							v-divider
							v-row.mt-5
								v-col(cols="12" sm="6")
									v-text-field(v-model="mechanicalEngineEfficiency" label='Механический КПД двигателя, η' required outlined color="#00897B" suffix="%" hint="При отсутствии данных принимать из интервала 75-96%" type='number' placeholder="96").mb-2
									v-text-field(v-model="mechanicalGearboxEfficiency" label='Механический КПД редуктора, ηдв' required outlined color="#00897B" suffix="%" hint="При газоотурбинном наддуве, при отсутствии редуктора для привода воздуходувки, потери отутствуют, ввести 100" type='number' placeholder="100").mb-2
								v-col(cols="12" sm="6")
									v-text-field(v-model="mechanicalTurbineEfficiency" label='КПД турбины, ηт' required outlined color="#00897B" suffix="%" hint="При отсутствии рекомендация принимать из интервала 76-86%" type='number' placeholder="82").mb-2
									v-text-field(v-model="mechanicalCompressorEfficiency" label='КПД компрессора, ηк' required outlined color="#00897B" suffix="%" hint="При отсутствии данных принимать из интервала 72-84%" type='number' placeholder="82").mb-2
							v-divider
							v-row.mt-5
								v-col(cols="12" md="6")
									v-text-field(v-model="heatCoeff" label='Коэффициент использования тепла в точке "Z", ζz' required outlined color="#00897B" type='number' placeholder="0,92" hide-details).mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up")
										ul
											li.caption
												span.font-weight-bold.cyan--text МОД 
												span - 0.75-0.92
											li.caption
												span.font-weight-bold.cyan--text СОД 
												span - 0.75-0.92
											li.caption
												span.font-weight-bold.cyan--text ВОД 
												span - 0.7-0.95
									v-text-field(v-model="fullheatCoeff" label='Полный коэффициент использования тепла, ζ' required outlined color="#00897B" type='number' placeholder="0,96" hide-details).mb-2
									v-alert(text dense color='teal' border='left' icon="mdi-arrow-up")
										ul
											li.caption
												span.font-weight-bold.cyan--text МОД 
												span - 0.86-0.99
											li.caption
												span.font-weight-bold.cyan--text СОД 
												span - 0.86-0.99
											li.caption
												span.font-weight-bold.cyan--text ВОД 
												span - 0.85-0.95
								v-col(cols="12" md="6")
									v-select(v-model="IndicatorRoundingCoefficient" placeholder="0,98" outlined label="Коэффициент округления индикаторной диаграммы, φz" :items="['0.95','0.96','0.97','0.98']" required color="#00897B" item-color="warning").mb-2
									//секекты выбора коэффициента продувки
									v-text-field(v-if="engineBoostType=='0'" v-model="BoostCoef" label='Коэффициент продувки, φ' required outlined color="#00897B" type='number' placeholder="1,3").mb-2
									v-select(v-else-if="selectCycle=='2' && !engineBoostType=='0'" v-model="BoostCoef" placeholder="1,3" outlined label="Коэффициент продувки, φ" :items="BoostCoefTwoStroke" required color="#00897B" item-color="warning").mb-2
									v-select(v-else-if="selectCycle=='4' && !engineBoostType=='0'" v-model="BoostCoef" placeholder="1,3" outlined label="Коэффициент продувки, φ" :items="BoostCoefFourStroke" required color="#00897B" item-color="warning").mb-2
									v-select(v-else v-model="BoostCoef" placeholder="Доступно после выбора тактности и типа наддува" outlined label="Коэффициент продувки, φ" required color="#00897B" disabled).mb-2
									// конец селектов
									v-row
										v-col(cols="12" md="3")
											v-text-field(v-model="ResidualGasRatio" label='Коэффициент остаточных газов, γ' required outlined color="#00897B" type='number' hint="Коэффициент остаточных газов, γ" placeholder="0,025").mb-2
										v-col(cols="12" md="9")
											v-alert(text dense color='teal' border='left' icon="mdi-arrow-left")
												ul
													li.caption
														span.font-weight-bold.cyan--text 2-х тактные с прямоточной схемой газообмена 
														span - 0.02-0.09
													li.caption
														span.font-weight-bold.cyan--text 2-х тактные с контурной схемой газообмена 
														span - 0.01-0.14
													li.caption
														span.font-weight-bold.cyan--text 4-х тактные 
														span - 0.01-0.04
							v-divider
							v-row.mt-5
								v-col(cols="12" md="6")
									v-text-field(v-model="kb" label='Показатель политропы сжатия воздуха в компрессоре, kb' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="kg" label='Показатель политропы расширения газов в турбине, kg' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="a1" label='Постоянная уравнения средней мольной теплоемкости воздуха при сжатии, a1' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="a2" label='Постоянная уравнения изохорной теплоемкости продуктов сгорания, a2' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="b1" label='Постоянная уравнения средней мольной теплоемкости продуктов сгорания, b1' required outlined color="#00897B" type='number' disabled).mb-2
								v-col(cols="12" md="6")
									v-text-field(v-model="b2" label='Постоянная уравнения изохорной теплоемкости сгорания, b2' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="n1" label='Первое приближение показателя политропы сжатия воздуха в цилиндре, n1' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="n2" label='Первое приближение показателя политропы расширения газов в цилиндре, n2' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="rg" label='Газовая постоянная продуктов сгорания, rg' required outlined color="#00897B" suffix="кДж/(кг*К)" type='number' disabled).mb-2
									v-text-field(v-model="rb" label='Газовая постоянная воздуха, rb' required outlined color="#00897B" suffix="кДж/(кг*К)" type='number' disabled).mb-2
		v-card.mt-8.p-4(:elevation="6" min-width="100%")
			v-row
				v-col(cols="12").d-flex.flex-column.justify-space-between.card_text.align-start.pl-6.pr-6
					h2.text-center.pl-3 Динамический расчет
					v-container(:fluid="true")
						v-form(ref="form" :lazy-validation="false")
							v-row
								v-col(cols="12" md="6")
									h4.mb-4 Параметры из предыдущего расчета:
									v-text-field(v-model="engineCylinderNum" label='Число цилиндров, z' required suffix="штук" outlined color="#00897B" disabled type='number').mb-2
									v-text-field(v-model="selectCycle" label="Тактность, ν" required outlined color="#00897B" disabled type='number').mb-2
									v-text-field(v-model="engineCylinderDiameter" label='Диаметр цилиндра, D' required suffix="мм" outlined color="#00897B" disabled type='number').mb-2
									v-text-field(v-model="crankRadius" label='Радиус кривошипа, r' required suffix="мм" outlined color="#00897B" disabled type='number').mb-2
									v-text-field(v-model="lostStrokeRate" label='Доля потерянного хода поршня, Ψ' required outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="engineRotationFrequency" label='Частота вращения коленчатого вала, n' required suffix="об/мин" outlined color="#00897B" type='number' disabled).mb-2
									v-text-field(v-model="compressionRatio" label='Степень сжатия, ε' required outlined color="#00897B" disabled type='number').mb-2
								v-col(cols="12" md="6")
									v-select(v-model="engineRow" outlined label="Рядность" required color="#00897B" item-color="warning" :items="[1,2]" hide-details).mb-6.mt-10
									v-row
										v-col(cols="12" md="5")
											v-text-field(v-model="ksmConst" label='Постоянная КШМ, λ' required outlined color="#00897B" type='number' placeholder="0,25" hint="Отношение длины кривошипа к длине шатуна, принимать в диапазоне 0.2 - 0.5" hide-details).mb-2
											v-btn(color="#00897B" :large="true" @click.stop="ksmDialog = true").theme--light.v-btn.custom-btn.mb-6 Расчет массы КШМ
											v-dialog(v-model="ksmDialog" min-width="300")
												v-card
													v-card-title.headline.mb-4.pt-6 Параметры топлива
													v-btn(icon @click='ksmDialog = false').dialog-close
														v-icon mdi-close
													v-card-text
														v-row
															v-col(cols="12" sm="6" md="3")
																v-text-field(v-model="engineCylinderDiameterinMeters" label='Диаметр цилиндра' suffix="м" required disabled outlined color="#00897B" type="number")
															v-col(cols="12" sm="6" md="3")
																v-text-field(v-model="engineCylinderSshort" label='Площадь поршня' required disabled outlined color="#00897B" type="number")
																	template(slot='append')
																		span м
																			sup 2
															v-col(cols="12" sm="6" md="3")
																v-text-field(v-model="ksmMass1" label='Приведенная масса поступательно движущихся частей КШМ' required outlined color="#00897B" type="number" hint="Приведенная масса поступательно движущихся частей КШМ")
																	template(slot='append')
																		span кг/м
																			sup 2
															v-col(cols="12" sm="6" md="3")
																v-text-field(v-model="ksmMass2" label='Приведенная масса вращающихся частей КШМ' required outlined color="#00897B" type="number" hint="Приведенная масса вращающихся частей КШМ")
																	template(slot='append')
																		span кг/м
																			sup 2
															v-col(cols="12" md="6")
																v-text-field(v-model="ksmMass3" label='Искомая поступа- тельная масса КШМ' suffix="кг" required outlined color="#00897B" disabled type="number")
															v-col(cols="12" md="6")
																v-text-field(v-model="ksmMass4" label='Искомая  вращающаяся масса КШМ' suffix="кг" required outlined color="#00897B" disabled type="number")
															v-col(cols="12")
																v-simple-table
																	template(v-slot:default)
																		thead
																			tr
																				th(colspan="3") Ориентировочные значения приведенных массы КШМ   (по_Ваншейдту), кг/м
																					sup 2
																		tbody
																			tr
																				td(colspan="3").bg-lightgreen
																					p.text-center.mb-0 Поступательная
																			tr
																				td(colspan="2").bg-aliceblue МОД
																				td.bg-lavender 2500-6000
																			tr
																				td.bg-aliceblue СОД
																				td.bg-aliceblue с силуминовыми или тонкостенными чугунными и стальными поршнями
																				td.bg-lavender 1000-2000
																			tr
																				td.bg-aliceblue СОД
																				td.bg-aliceblue с толстостенными чугунными поршнями
																				td.bg-lavender 1500-3000
																			tr
																				td(colspan="2").bg-aliceblue ВОД
																				td.bg-lavender 300-700
																			tr
																				td(colspan="3").bg-lightgreen
																					p.text-center.mb-0 Вращающаяся
																			tr
																				td(colspan="2").bg-aliceblue МОД
																				td.bg-lavender 7000-12000
																			tr
																				td.bg-aliceblue СОД
																				td.bg-aliceblue с силуминовыми или тонкостенными чугунными и стальными поршнями
																				td.bg-lavender 1500-2500
																			tr
																				td.bg-aliceblue СОД
																				td.bg-aliceblue с толстостенными чугунными поршнями
																				td.bg-lavender 1500-2500
																			tr
																				td(colspan="2").bg-aliceblue ВОД
																				td.bg-lavender 300-1000
										v-col(cols="12" md="7")
											v-alert(text dense color='teal' border='left' icon="mdi-arrow-left")
												p.caption.mb-2 Если известно значение длины шатуна, L, можно расчитать постоянную КШМ по формуле r/L:
												v-btn(v-if="connectingRod==false" color="#00897B" @click="connectingRod=true").theme--light.v-btn.custom-btn Расчитать
												v-btn(v-else color="#00897B" @click="connectingRod=false").theme--light.v-btn.custom-btn Отмена
											v-text-field(v-show="connectingRod" v-model="connectingRodParam" label='Длина шатуна, L' required outlined color="#00897B" type='number' placeholder="400" suffix="мм").mb-2
									v-row(v-if="this.engineCylinderDiameter.length > 0 && this.ksmMass2.length > 0 && this.ksmMass1.length > 0")
										v-col(cols="12")
											p.mb-1 Расчитанное значение массы поступательно движущихся частей: 
												span {{ksmMass3}} кг
											p Расчитанное значение массы вращающихся частей: 
												span {{ksmMass4}} кг
									v-text-field(v-model="MassOfProgressivelyMovingParts" label='Масса поступательно движущихся частей, mn' suffix="кг" required outlined color="#00897B")
									v-text-field(v-model="MassofRotatingParts" label='Масса вращающихся частей, mв' suffix="кг" required outlined color="#00897B")
									v-text-field(v-model="angleVengine" label='Угол развала блоков, γ' required outlined color="#00897B" type='number').mb-2
										template(slot='append')
											span &#176;
									v-text-field(v-model="CrankshaftAngle" label='Угол заклинки коленчатого вала, δ' disabled required outlined color="#00897B" type='number').mb-2
										template(slot='append')
											span &#176;
							v-divider
							v-row.mt-5
								v-col(cols="12" md="6")
									v-text-field(v-model="Pa" label='Давление в начале сжатия, Pа' required outlined color="#00897B" suffix="МПа" type='number').mb-2
								v-col(cols="12" md="6")
									p Имя: {{name}}
									p Группа: {{group}}
									p Содержание углерода и водорода в топливе: {{carbon_hydrogen_content}}
</template>
<script>
import { mapMutations } from 'vuex'

export default {
	data() {
		return {
			BoostCoefTwoStroke: ['1.25', '1.3', '1.35', '1.4', '1.45', '1.5', '1.55', '1.6', '1.65', '1.7', '1.75', '1.8'],
			BoostCoefFourStroke: ['1.05', '1.1', '1.15', '1.2', '1.25', '1.3', '1.35'],
			HeatedChargeFromCylinderOne: ['5', '6', '7', '8', '9', '10'],
			HeatedChargeFromCylinderTwo: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
			pressureBehindTheTurbine: ['0.101', '0.102', '0.103', '0.104', '0.105', '0.106'],
			BoostPressureTwoStroke: ['0.14', '0.15', '0.16', '0.17', '0.18', '0.19', '0.2'],
			BoostPressureFourStroke: ['0.13', '0.14', '0.15', '0.16', '0.17', '0.18', '0.19', '0.2', '0.21', '0.22', '0.23', '0.24', '0.25', '0.26', '0.27', '0.28', '0.29', '0.3'],
			fuelHeaders: [
				{
					text: 'Тип топлива/ параметр',
					align: 'left',
					sortable: false,
					value: 'name',
				},
				{ text: 'Плотность при 15 ºС, кг/куб.м', value: 'fuelDensity' },
				{ text: 'Содержание серы, % масс., не более', value: 'sulfurContent' },
				{ text: 'Содержание воды, %, объемн., не более', value: 'fuelWater' },
				{ text: 'Зольность, %, не более', value: 'AshContent' },
			],
			fuelItems: [
				{name: 'DМХ', fuelDensity: '880', sulfurContent: '1', fuelWater: '0', AshContent: '0.01', type: 'Дистилятное топливо', carbon_hydrogen: '84,3/13'},
				{name: 'DМA', fuelDensity: '890', sulfurContent: '1.5', fuelWater: '0', AshContent: '0.01', type: 'Дистилятное топливо', carbon_hydrogen: '83,9/12,8'},
				{name: 'DМZ', fuelDensity: '890', sulfurContent: '1.5', fuelWater: '0', AshContent: '0.01', type: 'Дистилятное топливо', carbon_hydrogen: '84,5/12,6'},
				{name: 'DМB', fuelDensity: '900', sulfurContent: '2', fuelWater: '0.3', AshContent: '0.01', type: 'Дистилятное топливо', carbon_hydrogen: '83,7/12,4'},
				{name: 'RMA 10', fuelDensity: '920', sulfurContent: '2', fuelWater: '0.3', AshContent: '0.04', type: 'Остаточное топливо', carbon_hydrogen: '85,6/11,8'},
				{name: 'RMB 30', fuelDensity: '960', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.07', type: 'Остаточное топливо', carbon_hydrogen: '84,4/11,6'},
				{name: 'RMD 80', fuelDensity: '975', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.07', type: 'Остаточное топливо', carbon_hydrogen: '84,4/11,4'},
				{name: 'RME 180', fuelDensity: '991', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.07', type: 'Остаточное топливо', carbon_hydrogen: '84,4/11,2'},
				{name: 'RMG 180', fuelDensity: '991', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.07', type: 'Остаточное топливо', carbon_hydrogen: '85,6/10,8'},
				{name: 'RMG 380', fuelDensity: '991', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.1', type: 'Остаточное топливо', carbon_hydrogen: '85,9/10,7'},
				{name: 'RMG 500', fuelDensity: '991', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.1', type: 'Остаточное топливо', carbon_hydrogen: '86,2/10,6'},
				{name: 'RMG 700', fuelDensity: '991', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.1', type: 'Остаточное топливо', carbon_hydrogen: '86,5/10,6'},
				{name: 'RMK 380', fuelDensity: '1010', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.15', type: 'Остаточное топливо', carbon_hydrogen: '86/10,4'},
				{name: 'RMK 500', fuelDensity: '1010', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.15', type: 'Остаточное топливо', carbon_hydrogen: '86,3/10,3'},
				{name: 'RMK 700', fuelDensity: '1010', sulfurContent: '2', fuelWater: '0.5', AshContent: '0.15', type: 'Остаточное топливо', carbon_hydrogen: '86,6/10,2'},
			],
			engineName: '',
			enginePower: '',
			engineRotationFrequency: '',
			enginePistonStroke: '',
			engineCylinderDiameter: '',
			engineCylinderNum: '',
			engineBoostType: '',
			selectCycle: '',
			initialTemp: '27',
			initialCombustionTemperature: '2000',
			HeatedChargeFromCylinder: '',
			temp1: '',
			temp2: '',
			temp3: '',
			AirRatioMin: '',
			AirRatioMax: '',
			headLossParam: '',
			environmentalPressure: '0.1033',
			pressureBehindTheTurbineParam: '',
			CyclePressureMax: '',
			BoostPressure: '',
			compressionRatio: '',
			lostStrokeRate: '',
			pressureIncreaseParam: '',
			AirMolarWeight: '28.97',
			fuelDialog: false,
			kb: 1.4,
			kg: 1.35,
			a1: 19.26,
			a2: 20.473,
			b1: 0.0025,
			b2: 0.00364,
			n1: 1.3,
			n2: 1.2,
			rg: 0.286,
			rb: 0.287,
			fuelSelected: [],
			coefficientOfExcessAir: 0.1,
			coefficientOfExcessPressure: 0.05,
			CalculationError: 0.5,
			CalculationErrorPressure: 0.5,
			boostType: [],
			mechanicalEngineEfficiency: '',
			mechanicalGearboxEfficiency: '',
			mechanicalTurbineEfficiency: '',
			mechanicalCompressorEfficiency: '',
			heatCoeff: '',
			fullheatCoeff: '',
			IndicatorRoundingCoefficient: '',
			BoostCoef: '',
			ResidualGasRatio: '',
			headLossParamComputed: '',
			// динамический расчет
			ksmMass1: '',
			ksmMass2: '',
			engineRow: '',
			ksmDialog: false,
			connectingRod: false,
			angleVengine: 0,
			connectingRodParam: '',
		}
	},
	computed: {
		table () {
			return this.$store.state.table
		},
		name() {
			return this.$store.state.name
		},
		group() {
			return this.$store.state.group
		},
		email() {
			return this.$store.state.email
		},
		BoostCoefWithout() {
			if (this.engineBoostType == '0') return this.BoostCoef = '0.95';
		},
		fuelNameComputed() {
			if (this.fuelSelected.length > 0) return this.fuelSelected[0]['name'];
		},
		fuelDensityComputed() {
			if (this.fuelSelected.length > 0) return this.fuelSelected[0]['fuelDensity'];
		},
		sulfurContentComputed() {
			if (this.fuelSelected.length > 0) return this.fuelSelected[0]['sulfurContent'];
		},
		fuelWaterComputed() {
			if (this.fuelSelected.length > 0) return this.fuelSelected[0]['fuelWater'];
		},
		carbon_hydrogen_content() {
			if (this.fuelSelected.length > 0) return this.fuelSelected[0]['carbon_hydrogen'];
		},
		AshContentComputed() {
			if (this.fuelSelected.length > 0) return this.fuelSelected[0]['AshContent'];
		},
		NetCalorificValue() {
			if (this.fuelSelected.length > 0) {
				let p = +this.fuelSelected[0]['fuelDensity'];
				let s = +this.fuelSelected[0]['sulfurContent'];
				let w = +this.fuelSelected[0]['fuelWater'];
				let a = +this.fuelSelected[0]['AshContent'];
				let netCalorific2 = 1 - 0.01*(w*999.13/p + s + a);
				let netCalorific3 = 0.0942*s - 0.02449*w*999.13/p;
				if (this.fuelSelected[0]['type'] == 'Дистилятное топливо') {
					let netCalorific1 = (46.423 - 8.792*Math.pow(10, -6)*Math.pow(p,2) + 3.167*p*Math.pow(10, -3));
					let netCalorific = ((netCalorific1*netCalorific2+netCalorific3)*1000).toFixed(0);
					return netCalorific;
				} else {
					let netCalorific1 = (46.704 - 8.802*Math.pow(10, -6)*Math.pow(p,2) + 3.167*p*Math.pow(10, -3));
					let netCalorific = ((netCalorific1*netCalorific2+netCalorific3)*1000).toFixed(0);
					return netCalorific;
				}
			} 
		},
		// динамический расчет
		Pa() {
			return 0;
		},
		CrankshaftAngle() {
			if (this.selectCycle.length > 0 && this.engineCylinderNum.length > 0) {
				return (this.selectCycle*180/this.engineCylinderNum).toFixed(5);
			}
		},
		MassOfProgressivelyMovingParts() {
			if (this.engineCylinderDiameter.length > 0 && this.ksmMass1.length > 0) {
				return (this.ksmMass1*this.engineCylinderS).toFixed(0);
			}
		},
		MassofRotatingParts() {
			if (this.engineCylinderDiameter.length > 0 && this.ksmMass2.length > 0) {
				return (this.ksmMass2*this.engineCylinderS).toFixed(0);
			}
		},
		ksmMass3() {
			if (this.engineCylinderDiameter.length > 0 && this.ksmMass1.length > 0) {
				return (this.ksmMass1*this.engineCylinderS).toFixed(2);
			}
		},
		ksmMass4() {
			if (this.engineCylinderDiameter.length > 0 && this.ksmMass2.length > 0) {
				return (this.ksmMass2*this.engineCylinderS).toFixed(2);
			}
		},
		engineCylinderS() {
			if (this.engineCylinderDiameter.length > 0) {
				let formula = 3.14159*Math.pow(this.engineCylinderDiameterinMeters, 2)/4;
				return formula;
			} 
		},
		engineCylinderSshort() {
			if (this.engineCylinderDiameter.length > 0) {
				let formula = 3.14159*Math.pow(this.engineCylinderDiameterinMeters, 2)/4;
				return formula.toFixed(2);
			} 
		},
		engineCylinderDiameterinMeters() {
			if (this.engineCylinderDiameter.length > 0) return this.engineCylinderDiameter/1000;
		},
		crankRadius() {
			if (this.enginePistonStroke.length > 0) return this.enginePistonStroke/2;
		},
		ksmConst() {
			if (this.enginePistonStroke.length > 0 && this.connectingRodParam.length > 0 && this.connectingRod == true) {
				return this.crankRadius/(2*this.connectingRodParam);
			} else {
				return 0.25;
			}
		}
	}
}
</script>

<style lang="stylus">
.image_container
	height 100%
	padding 0 20px
.card_text
	height 100%
.theme--light.v-btn.custom-btn
	color white
	&_fuel
		height 56px
		margin-bottom 36px
.dialog-close
	position absolute
	top 10px
	right 10px
.bg-lightgreen
	background-color #00796B
	color white
.bg-aliceblue
	background-color aliceblue
.bg-lavender
	background-color lavender
	text-align center
.v-data-table.theme--dark .bg-aliceblue
	background-color darkslategray
.v-data-table.theme--dark .bg-lavender
	background-color slategrey
</style>