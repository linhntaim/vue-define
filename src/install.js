import dotenvConversion from 'dotenv-conversion'
import Define from './define'
import DefineManager from './define_manager'

const install = (Vue, {defines = {}, dotEnvConversionConfigOptions = {}} = {}) => {
    dotenvConversion.make({}, dotEnvConversionConfigOptions)
    DefineManager.append(dotenvConversion.getenv())
    DefineManager.append(defines)
    Vue.prototype.$defineManager = DefineManager
    Vue.prototype.$define = Define
}

export default install