import Vue from 'vue';
import Element from 'element-ui'
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import twLocale from 'element-ui/lib/locale/lang/zh-TW'
import en from './locale/en'
import zh from './locale/zh-CN'
import tw from './locale/tw.json'
const messages={
  en: {
      ...en,
      ...enLocale
  },
  zh: {
      ...zh,
      ...zhLocale
  },
  tw: {
    ...tw,
    ...twLocale
  }
}
let lang = localStorage.getItem('lang');

Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: lang, //设置默认语言
	messages,
    silentTranslationWarn: true
});

Vue.use(Element,{
    i18n:(key,value) => i18n.t(key,value)
})
export default i18n;
