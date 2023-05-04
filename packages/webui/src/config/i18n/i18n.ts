// import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import { initReactI18next } from 'react-i18next';
// demo
// https://codesandbox.io/s/1zxox032q?file=/src/app.js
// const require = import.meta.glob('/**/*.i18n.ts', { eager: true });
// const modalFiles = context.keys();
// const resources = modalFiles.map((ele: string) => {
//   return context(ele).default;
// });
// const transMap: {
//   [key: string]: {
//     translations: { [key: string]: string };
//   };
// } = {};
// resources.forEach(
//   (ele: {
//     [key: string]: {
//       translations: { [key: string]: string };
//     };
//   }) => {
//     Object.keys(ele).forEach((lan) => {
//       if (!transMap[lan]) {
//         transMap[lan] = {
//           translations: {},
//         };
//       }
//       transMap[lan].translations = {
//         ...transMap[lan].translations,
//         ...ele[lan].translations,
//       };
//     });
//   },
// );
// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: transMap,
//     fallbackLng: 'en',
//     debug: import.meta.env.DEV,
//     ns: ['translations'],
//     defaultNS: 'translations',
//   });

export default {};
