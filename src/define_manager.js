import Define from './define'

class DefineManager {
    append(...defines) {
        let define
        while ((define = defines.shift())) {
            for (const key in define) {
                this.set(key, define[key])
            }
        }
    }

    import(...promised) {
        return new Promise((resolve, reject) => {
            const matching = promised.length
            let matched = 0, p
            while ((p = promised.shift())) {
                p.then(defines => {
                    if (defines.hasOwnProperty('default')) {
                        this.append(defines.default)
                    } else {
                        this.append(defines)
                    }
                    ++matched
                    if (matched === matching) {
                        resolve()
                    }
                }).catch(e => {
                    reject(e)
                })
            }
        })
    }

    get(name = null) {
        return name ? this.tryGet(Define, name) : Define
    }

    tryGet(define, name) {
        const [name1, name2] = name.split('.', 2)
        if (define.hasOwnProperty(name1)) {
            return name2 ? this.tryGet(define[name1], name2) : define[name1]
        }
        return null
    }

    set(name, value, force = true) {
        this.trySet(Define, name, value, force)
    }

    trySet(define, name, value, force) {
        const names = name.split('.'),
            name1 = names.shift(),
            name2 = names.join('.')

        const check = () => {
            if (!define.hasOwnProperty(name1)) {
                define[name1] = {}
            } else {
                if (typeof define[name1] !== 'object' || define[name1].constructor !== Object) {
                    if (force) define[name1] = {}
                    else return false
                }
            }
            return true
        }

        if (name2) {
            if (check()) {
                this.trySet(define[name1], name2, value, force)
            }
            return
        }

        if (value && typeof value === 'object' && value.constructor === Object) {
            if (check()) {
                for (const key in value) {
                    this.trySet(define[name1], key, value[key], force)
                }
            }
        } else {
            define[name1] = value
        }
    }
}

export default new DefineManager()