# vue-define

[![NPM version](https://img.shields.io/npm/v/vue-define.svg?style=flat-square)](https://www.npmjs.com/package/vue-define)
[![Travis (.org)](https://img.shields.io/travis/linhntaim/vue-define?style=flat-square)](https://travis-ci.org/linhntaim/vue-define)
[![Coveralls github](https://img.shields.io/coveralls/github/linhntaim/vue-define?style=flat-square)](https://coveralls.io/github/linhntaim/vue-define)
[![NPM](https://img.shields.io/npm/l/vue-define?style=flat-square)](https://github.com/linhntaim/vue-define/blob/master/LICENSE)

Manage environment variables & configurations in Vue application.

Powered by [dotenv-conversion](https://github.com/linhntaim/dotenv-conversion).

## Install

```bash
npm install vue-define
```

## Usage

Create Vue application:

```javascript
import Vue from 'vue'
import VueDefine from 'vue-define'

...

// Without options
Vue.use(VueDefine)

// With options
Vue.use(VueDefine, options)

...

new Vue({...}).$mount('#app')
```

**Options**

- **`options`**

  *(optional)* Must be an object.
  
  Has attributes of `defines` and `dotenvConversionConfigOptions`.

- **`options.defines`**

  *(optional)* Must be an object.
  
  To define some pre-configurations if wanted. 
  
  Eg: `{APP_TITLE: 'My Website', APP_DESCRIPTION': 'A sample page of mine'}`.
  
- **`options.dotenvConversionConfigOptions`**

  *(optional)* Must be an object.
  
  To use with features of `dotenv-conversion`.
  
  Eg: `{specs: { ... }, override: { ... }, prevents: { ... }}`.

  See [`dotenv-conversion`](https://github.com/linhntaim/dotenv-conversion#features).

## Features

### Get or Set Configuration

Example of .env file in Vue application:

```dotenv
# .env file
VUE_APP_TITLE='My Website'
VUE_APP_DEBUG=true
VUE_APP_DATA='{"foo":"bar"}'
```

Those environment variables above will be automatically set in configuration after creating Vue application with `vue-define`.

#### Used in Vue components

```vue
// .vue file

<template>
   ...
</template>

<script>
export default {
    name: 'MyComponent',
    created() {

        // **Configuration**

        // Getting

        console.log(this.$defineManager.get('VUE_APP_TITLE')) // (string) 'My Website'
        console.log(this.$define.VUE_APP_TITLE) // (string) 'My Website'

        console.log(this.$defineManager.get('VUE_APP_DEBUG')) // (boolean) true
        console.log(this.$define.VUE_APP_DEBUG) // (boolean) true

        console.log(this.$defineManager.get('VUE_APP_DATA')) // (object) {foo: 'bar'}
        console.log(this.$define.VUE_APP_DATA) // (object) {foo: 'bar'}
        console.log(this.$defineManager.get('VUE_APP_DEBUG.foo')) // (string) 'bar'
        console.log(this.$define.VUE_APP_DATA.foo) // (string) 'bar'
        
        console.log(this.$defineManager.get('VUE_APP_NOT_SET')) // null
        console.log(this.$defineManager.get('VUE_APP_NOT_SET', 'default_value')) // (string) 'default_value'
        console.log(this.$define.VUE_APP_NOT_SET) // undefined

        // Setting

        this.$defineManager.set('VUE_APP_DATA.animals.dog', 'dog')
        this.$defineManager.set('VUE_APP_DATA.animals.cat', 'cat')
        console.log(this.$defineManager.get('VUE_APP_DATA.animals')) // (object) {dog: 'dog', cat: 'cat'}
        console.log(this.$define.VUE_APP_DATA.animals) // (object) {dog: 'dog', cat: 'cat'}
    
        this.$define.VUE_APP_DATA.vehices = {
            car: 'car',
            bike: 'bike',
        }
        console.log(this.$defineManager.get('VUE_APP_DATA.vehicles')) // (object) {car: 'car', bike: 'bike'}
        console.log(this.$defineManager.get('VUE_APP_DATA.vehicles.car')) // (string) 'car'
        console.log(this.$defineManager.get('VUE_APP_DATA.vehicles.bike')) // (string) 'bike'
        
        this.$defineManager.set('custom.value', 'value')
        console.log(this.$define.custom) // (object) {value: 'value'}

    }
}
</script>
```

#### Used in anywhere

```javascript
import {Define, DefineManager, getenv} from 'vue-define'

...

// **Environment variables**

const env = getenv()

console.log(env)
// output:
// {
//    VUE_APP_TITLE: 'My Website',
//    VUE_APP_DEBUG: true,
//    VUE_APP_DATA: {
//       foo: 'bar',
//    },
// }

// **Configuration**

// Getting

console.log(DefineManager.get('VUE_APP_TITLE')) // (string) 'My Website'
console.log(Define.VUE_APP_TITLE) // (string) 'My Website'

console.log(DefineManager.get('VUE_APP_DEBUG')) // (boolean) true
console.log(Define.VUE_APP_DEBUG) // (boolean) true

console.log(DefineManager.get('VUE_APP_DATA')) // (object) {foo: 'bar'}
console.log(Define.VUE_APP_DATA) // (object) {foo: 'bar'}
console.log(DefineManager.get('VUE_APP_DEBUG.foo')) // (string) 'bar'
console.log(Define.VUE_APP_DATA.foo) // (string) 'bar'

console.log(DefineManager.get('VUE_APP_NOT_SET')) // null
console.log(DefineManager.get('VUE_APP_NOT_SET', 'default_value')) // (string) 'default_value'
console.log(Define.VUE_APP_NOT_SET) // undefined

// Setting

DefineManager.set('VUE_APP_DATA.animals.dog', 'dog')
DefineManager.set('VUE_APP_DATA.animals.cat', 'cat')
console.log(DefineManager.get('VUE_APP_DATA.animals')) // (object) {dog: 'dog', cat: 'cat'}
console.log(Define.VUE_APP_DATA.animals) // (object) {dog: 'dog', cat: 'cat'}

Define.VUE_APP_DATA.vehices = {
    car: 'car',
    bike: 'bike',
}
console.log(DefineManager.get('VUE_APP_DATA.vehicles')) // (object) {car: 'car', bike: 'bike'}
console.log(DefineManager.get('VUE_APP_DATA.vehicles.car')) // (string) 'car'
console.log(DefineManager.get('VUE_APP_DATA.vehicles.bike')) // (string) 'bike'

DefineManager.set('custom.value', 'value')
console.log(Define.custom) // (object) {value: 'value'}
```

### Custom Configuration from Files

Example of configuration files:

```javascript
// config.app.js file
export const LOG_ENABLED = true
export const LOG_METHOD = 'console'
```

```javascript
// config.locale.js file
export default {
    LOCALES: {
        en: 'English',
        vi: 'Tiếng Việt',
    },
    DEFAULT_LOCALE: 'en',
    FALLBACK_LOCALE: 'en',
}
```

```json
// config.lang.en.json file
{
    "LANG": {
        "en": {
            "hello": "Hello"
        }
    }
}
```

```json
// config.lang.vi.json file
{
    "LANG": {
        "vi": {
            "hello": "Xin chào"
        }
    }
}
```

Load from those configuration files above:

```javascript
import {Define, DefineManager} from 'vue-define'

DefineManager.import(
    import('./config.app'),
    import('./config.locale'),
    import('./config.lang.en.json'),
    import('./config.lang.vi.json')
).then(() => {
    console.log(Define.LOG_ENABLED) // (boolean) true
    console.log(Define.LOG_METHOD) // (string) 'console'
    console.log(Define.LOCALES) // (object) {en: 'English', vi: 'Tiếng Việt'}
    console.log(Define.DEFAULT_LOCALE) // (string) 'en'
    console.log(Define.FALLBACK_LOCALE) // (string) 'en'
    console.log(Define.LANG) // (object) {en: {hello: 'Hello'}, vi: {hello: 'Xin chào'}
})
```

### Custom Configuration from Inline

```javascript
import {Define, DefineManager} from 'vue-define'

DefineManager.append({
    LOG_ENABLED: true,
    LOG_METHOD: 'console',
}, {
    LOCALES: {
        en: 'English',
        vi: 'Tiếng Việt',
    },
    DEFAULT_LOCALE: 'en',
    FALLBACK_LOCALE: 'en',
}, {
    LANG: {
        en: {
            hello: 'Hello',
        }   
    }
}, {
    LANG: {
        vi: {
            hello: 'Xin chào',
        }   
    }
})

console.log(Define.LOG_ENABLED) // (boolean) true
console.log(Define.LOG_METHOD) // (string) 'console'
console.log(Define.LOCALES) // (object) {en: 'English', vi: 'Tiếng Việt'}
console.log(Define.DEFAULT_LOCALE) // (string) 'en'
console.log(Define.FALLBACK_LOCALE) // (string) 'en'
console.log(Define.LANG) // (object) {en: {hello: 'Hello'}, vi: {hello: 'Xin chào'}
```