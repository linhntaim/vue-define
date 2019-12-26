import {default as install, DefineManager, Define, getenv} from '../src'
import mocha from 'mocha'
import chai from 'chai'

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect
chai.should()

describe('vue-define', function () {
    describe('unit tests', function () {
        describe('install', function () {
            it('install without options', function (done) {
                const input = {
                    VUE_APP_DEFINITION: 'definition',
                }
                const expected = {
                    VUE_APP_DEFINITION: 'definition',
                }

                Object.assign(process.env, input)
                const Vue = function () {
                }
                install(Vue)
                const vue = new Vue()

                vue.$defineManager.should.be.an.instanceOf(DefineManager.constructor)
                vue.$define.should.deep.equal(Define)
                vue.$define.should.deep.include(expected)
                getenv().should.deep.include(expected)
                getenv('VUE_APP_DEFINITION').should.deep.equal('definition')
                expect(getenv('VUE_APP_NOT_SET')).to.be.a('null')
                getenv('VUE_APP_NOT_SET', '').should.deep.equal('')

                done()
            })

            it('install with options', function (done) {
                const input = {
                    VUE_APP_DEFINITION_BOOL_AUTO: 'true',
                    VUE_APP_DEFINITION_NUMBER_SPEC_TO_BOOL: '1',
                    VUE_APP_DEFINITION_RAW_SPEC_TO_CUSTOM_UPPERCASE: 'text',
                    VUE_APP_DEFINITION_JSON_OVERRIDE: '{"foo":"bar"}',
                    VUE_APP_DEFINITION_BOOL_PREVENT: 'true',
                }
                const dotEnvConversionConfigOptions = {
                    specs: {
                        VUE_APP_DEFINITION_NUMBER_SPEC_TO_BOOL: 'bool',
                        VUE_APP_DEFINITION_RAW_SPEC_TO_CUSTOM_UPPERCASE(value) {
                            return value.toUpperCase()
                        },
                    },
                    override: {
                        json(value) {
                            try {
                                return {
                                    original: value,
                                    parsed: JSON.parse(value),
                                }
                            } catch (e) {
                                return value
                            }
                        },
                    },
                    prevents: ['VUE_APP_DEFINITION_BOOL_PREVENT'],
                }
                const inputDefines = {
                    predefine: 'predefine',
                }
                const expected = {
                    predefine: 'predefine',
                    VUE_APP_DEFINITION_BOOL_AUTO: true,
                    VUE_APP_DEFINITION_NUMBER_SPEC_TO_BOOL: true,
                    VUE_APP_DEFINITION_RAW_SPEC_TO_CUSTOM_UPPERCASE: 'TEXT',
                    VUE_APP_DEFINITION_JSON_OVERRIDE: {
                        original: '{"foo":"bar"}',
                        parsed: {
                            foo: 'bar',
                        },
                    },
                    VUE_APP_DEFINITION_BOOL_PREVENT: 'true',
                }

                Object.assign(process.env, input)
                const Vue = function () {
                }
                install(Vue, {
                    defines: inputDefines,
                    dotEnvConversionConfigOptions: dotEnvConversionConfigOptions,
                })
                const vue = new Vue()

                vue.$defineManager.should.be.an.instanceOf(DefineManager.constructor)
                vue.$define.should.deep.equal(Define)
                vue.$define.should.deep.include(expected)

                done()
            })
        })

        describe('define manager', function () {
            it('append method', function (done) {
                const input = {
                    a: 'a',
                }
                const expected = {
                    a: 'a',
                }

                DefineManager.append(input)

                Define.should.deep.include(expected)

                done()
            })

            it('append method (hierarchy)', function (done) {
                const input = {
                    b: {
                        a: 'ba',
                    },
                }
                const expected = {
                    b: {
                        a: 'ba',
                    },
                }

                DefineManager.append(input)

                Define.should.deep.include(expected)

                done()
            })

            it('append method (hierarchy 2)', function (done) {
                const input = {
                    'c.a': 'ca',
                }
                const expected = {
                    c: {
                        a: 'ca',
                    },
                }

                DefineManager.append(input)

                Define.should.deep.include(expected)

                done()
            })

            it('append method (hierarchy concat)', function (done) {
                const input = {
                    d: {
                        a: 'da',
                    },
                }
                const input2 = {
                    d: {
                        b: 'db',
                    },
                }
                const expected = {
                    d: {
                        a: 'da',
                        b: 'db',
                    },
                }

                DefineManager.append(input, input2)

                Define.should.deep.include(expected)

                done()
            })

            it('import method', function (done) {
                const input = './input.defines'
                const input2 = './input.defines2'
                const input3 = './input.defines3.json'
                const input4 = './input.defines4.json'
                const expected = {
                    DEFINE_A: 'define a',
                    DEFINE_B: 'define b',
                    DEFINE_C: 'define c',
                    DEFINE_D: 'define d',
                    DEFINE_EF: {
                        DEFINE_E: 'define e',
                        DEFINE_F: 'define f',
                    },
                }

                DefineManager.import(import(input), import(input2), import(input3), import(input4)).then(function () {
                    Define.should.deep.include(expected)

                    done()
                }).catch(function (e) {
                    done(e)
                })
            })

            it('import method (not exist)', function (done) {
                const input = './input.defines.not_exist'

                DefineManager.import(import(input)).then(function () {
                    done('existed')
                }).catch(function (e) {
                    done()
                })
            })

            it('get method', function (done) {
                const input = {
                    e: 'e',
                }

                DefineManager.append(input)

                Define.should.deep.include(input)

                const output1 = DefineManager.get('e')
                output1.should.be.a('string')
                output1.should.deep.equal('e')

                const output2 = DefineManager.get()
                output2.should.be.a('object')
                output2.should.deep.include({
                    e: 'e',
                })

                done()
            })

            it('get method (not exist)', function (done) {
                const input = {
                    e: 'e',
                }

                DefineManager.append(input)

                Define.should.deep.include(input)

                const output = DefineManager.get('not_existed_configuration')
                expect(output).to.be.a('null')

                done()
            })

            it('get method (hierarchy)', function (done) {
                const input = {
                    f: {
                        a: 'fa',
                    },
                }

                DefineManager.append(input)

                Define.should.deep.include(input)

                const output1 = DefineManager.get('f')
                output1.should.be.a('object')
                output1.should.deep.equal({
                    a: 'fa',
                })

                const output2 = DefineManager.get('f.a')
                output2.should.be.a('string')
                output2.should.deep.equal('fa')

                done()
            })

            it('get method (not set)', function (done) {
                const output1 = DefineManager.get('not_set')
                expect(output1).to.be.a('null')

                const output2 = DefineManager.get('not_set', '')
                output2.should.deep.equal('')

                done()
            })

            it('set method', function (done) {
                DefineManager.set('g', 'g')

                Define.should.deep.include({
                    g: 'g',
                })

                const output = DefineManager.get('g')
                output.should.be.a('string')
                output.should.deep.equal('g')

                done()
            })

            it('set method (hierarchy)', function (done) {
                DefineManager.set('h', {
                    a: 'ha',
                })

                Define.should.deep.include({
                    h: {
                        a: 'ha',
                    },
                })

                const output1 = DefineManager.get('h')
                output1.should.be.a('object')
                output1.should.deep.equal({
                    a: 'ha',
                })

                const output2 = DefineManager.get('h.a')
                output2.should.be.a('string')
                output2.should.deep.equal('ha')

                done()
            })

            it('set method (hierarchy 2)', function (done) {
                DefineManager.set('i.a', 'ia')

                Define.should.deep.include({
                    i: {
                        a: 'ia',
                    },
                })

                const output1 = DefineManager.get('i')
                output1.should.be.a('object')
                output1.should.deep.equal({
                    a: 'ia',
                })

                const output2 = DefineManager.get('i.a')
                output2.should.be.a('string')
                output2.should.deep.equal('ia')

                done()
            })

            it('set method (hierarchy concat)', function (done) {
                DefineManager.set('j.a', 'ja')
                DefineManager.set('j.b', 'jb')

                Define.should.deep.include({
                    j: {
                        a: 'ja',
                        b: 'jb',
                    },
                })

                const output1 = DefineManager.get('j')
                output1.should.be.a('object')
                output1.should.deep.equal({
                    a: 'ja',
                    b: 'jb',
                })

                const output2 = DefineManager.get('j.a')
                output2.should.be.a('string')
                output2.should.deep.equal('ja')

                const output3 = DefineManager.get('j.b')
                output3.should.be.a('string')
                output3.should.deep.equal('jb')

                done()
            })

            it('set method (override: force and not force)', function (done) {
                DefineManager.set('k', 'k')
                DefineManager.set('k', {a: 'ka'})
                DefineManager.set('k.a', {a: 'kaa'}, false)

                Define.should.deep.include({
                    k: {
                        a: 'ka',
                    },
                })

                const output = DefineManager.get('k')
                output.should.be.a('object')
                output.should.deep.equal({
                    a: 'ka',
                })

                done()
            })

            it('set method (override - append hierarchically: force and not force)', function (done) {
                DefineManager.set('l.a', 'la')
                DefineManager.set('l.a.a', 'laa')
                DefineManager.set('l.a.b', 'lab')
                DefineManager.set('l.a.b.a', 'laba', false)

                Define.should.deep.include({
                    l: {
                        a: {
                            a: 'laa',
                            b: 'lab',
                        },
                    },
                })

                const output = DefineManager.get('l')
                output.should.be.a('object')
                output.should.deep.equal({
                    a: {
                        a: 'laa',
                        b: 'lab',
                    },
                })

                done()
            })
        })
    })
})