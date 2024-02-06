// declare module "*.vue" {
//     import App from "vue"
//     export default App
// }

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}