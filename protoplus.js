const now =
  typeof globalThis.performance?.now === "function"
    ? ()=>Math.trunc(globalThis.performance.now.bind(globalThis.performance))
    : Date.now
const __nativeSort = Array.prototype.sort
const protoplus = {
    snapshots: {},
    global: {
        JSON: {
            isJSON: function (obj) {
                return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
            },
            iterate: function (obj, callback) {
                if (!JSON.isJSON(obj)) throw new Error('Argument "obj" has to be of type "JSON" ("object").')
                if (typeof callback !== 'function') throw new Error('Argument "callback" has to be of type "function".')
                for (let i = 0; i < Object.keys(obj).length; i++) {
                    callback(Object.keys(obj)[i], Object.values(obj)[i], i)
                }
            }
        },

        RegExp: {
            escape: (str)=>{
                return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            }
        },

        Array: {
            shuffle: (arr) => {
                if (!Array.isArray(arr)) return
                // Durstenfield shuffle script not made by me
                // Code from https://stackoverflow.com/a/12646864
                // Credit where it's due!
                // Thanks @Laurens Holst and @mwsundberg

                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr
            },
            genericType: (array) => {
                if (array.length === 0) return undefined;

                let baseType = Object.typeOf(array[0]);
                for (let i = 1; i < array.length; i++) {
                    if (Object.typeOf(array[i]) !== baseType)
                        return undefined;
                }

                return baseType
            }
        },

        Math: {
            clamp: (num, min, max) => {
                return Math.max(min, Math.min(max, num))
            },
            TAU: 2 * Math.PI,
            angle: {
                clampDeg: (deg) => deg % 360,
                clampRad: (rad) => rad % Math.TAU,
                radToDeg: (rad) => rad * 180 / Math.PI,
                degToRad: (deg) => deg * Math.PI / 180
            }
        },

        Number: {
            testFloatPrecision: () => {
                for (let i = 0; i < 5e2; i++) {
                    let baseNumber = 1
                    let testNumber = parseFloat(`0.${'9'.repeat(i)}`)
                    if (testNumber === baseNumber) {
                        Number.floatPrecision = i
                        return i
                    }
                }
            },
            testIntPrecision: () => Number.intPrecision = Number.MAX_SAFE_INTEGER
        },

        Object: {
            typeOf: (thing) => {
                if (typeof thing === 'object')

                    if (thing === null)
                        return 'null'

                    else if (Array.isArray(thing))
                        return 'array'

                    else
                        return 'object'

                else if (typeof thing === 'number') {

                    if (Number.isNaN(thing))
                        return 'nan'
                    else if (!Number.isFinite(thing))
                        return 'infinity'

                } else if (typeof thing === 'function') {

                    function isClass(value) {
                        if (typeof value !== 'function') return 
                        // do many tests to prove class status
                        const tests = [
                            Function.prototype.toString.call(value).startsWith("class "),
                            (()=>{
                                try {
                                    Reflect.construct(String, [], value)
                                    return false;
                                } catch (err) {
                                    return /class constructor/i.test(err?.message ?? err);
                                }
                            })(),
                            (()=>{
                                if (!value.prototype) return false;
                                return !Object.prototype.propertyIsEnumerable.call(value, 'prototype');
                            })(),
                            (() => {
                                if (!value.prototype) return false;
                                return Object.prototype.hasOwnProperty.call(value.prototype, 'constructor');
                            })(),
                            (() => {
                                return value[Symbol.toStringTag] === 'Function';
                            })()
                        ]

                        return tests.some(Boolean)
                    }
                    if (isClass(thing))
                        return 'class'
                    else
                        return 'function'

                } else
                    return typeof thing
            },
            types: Object.freeze( // made it a string so it's easier to add more
                'number,string,boolean,function,class,symbol,bigint,undefined,null,array,object,nan,infinity'
                .split(',')
            )
        }
    },

    proto: {
        Audio: {
            resume: function () {
                if (this.paused) {
                    this.play()
                    return true
                } else {
                    return false
                }
            }
        },

        Array: {
            last: function () {
                return this[this.length - 1]
            },
            shuffle: function () {
                let shuffled = Array.shuffle(this)
                shuffled.forEach((item, i) => {
                    this[i] = item
                })
                return shuffled
            },
            toShuffled: function () {
                return Array.shuffle([...this])
            },
            genericType: function () {
                return Array.genericType(this)
            },
            advSort: function (compareFn) {
                let arrType = this.genericType()

                if (compareFn !== undefined) {
                    if (typeof compareFn === 'function') {
                        ___nativeSort.call(this, compareFn)
                    } else {
                        throw new TypeError(`The comparison function should not be of type '${typeof compareFn}', only 'function' or 'undefined'`)
                    }
                } else {
                    if (arrType === 'number')
                        ___nativeSort.call(this, (a, b) => a - b)
                    else
                        ___nativeSort.call(this)
                }
                return this
            }
        },

        HTMLCollection: {
            last: function () {
                return this[this.length - 1]
            }
        },

        String: {
            last: function () {
                return this[this.length - 1]
            },
            escapeRegex: function () {
                return RegExp.escape(String(this))
            },
            trimLeft: function (...chars) {
                if (chars.length < 1) {
                    return this.trimStart(' ', '\t', '\n', '\r');
                } else {
                    let finalStr = String(this)
                    chars.forEach(char => {
                        if (typeof char !== 'string') return
                        finalStr = finalStr.replace(new RegExp(`^${char.escapeRegex()}+`), "");
                    })
                    return finalStr;
                }
            },
            trimStart: function (...chars) {
                if (chars.length < 1) {
                    return this.trimStart(' ', '\t', '\n', '\r');
                } else {
                    let finalStr = String(this)
                    chars.forEach(char => {
                        if (typeof char !== 'string') return
                        finalStr = finalStr.replace(new RegExp(`^${char.escapeRegex()}+`), "");
                    })
                    return finalStr;
                }
            },
            trimRight: function (...chars) {
                if (chars.length < 1) {
                    return this.trimEnd(' ', '\t', '\n', '\r');
                } else {
                    let finalStr = String(this)
                    chars.forEach(char => {
                        if (typeof char !== 'string') return
                        finalStr = finalStr.replace(new RegExp(`${char.escapeRegex()}+$`), "")
                    })
                    return finalStr;
                }
            },
            trimEnd: function (...chars) {
                if (chars.length < 1) {
                    return this.trimEnd(' ', '\t', '\n', '\r');
                } else {
                    let finalStr = String(this)
                    chars.forEach(char => {
                        if (typeof char !== 'string') return
                        finalStr = finalStr.replace(new RegExp(`${char.escapeRegex()}+$`), "")
                    })
                    return finalStr;
                }
            },
            trim: function (...chars) {
                return this.trimStart(...chars).trimEnd(...chars);
            },
            reverse: function () {
                return this.split('').reverse().join('')
            },
            chars: function () { return this.split('') },
            words: function () { return this.split(' ') },
            lines: function () { return this.split('\n') },
            forEach: function (callback, separator = '') {
                const separated = this.split(separator)
                for (let i = 0; i < separated.length; i++) {
                    callback(separated[i], i, this)
                }
                return;
            },
            toTitleCase: function (separator = ' ') {
                let str = String(this),
                    finalStr = [];

                str.split(separator).forEach((arg) => {
                    finalStr.push(arg[0].toUpperCase() + arg.substring(1))
                })

                return finalStr.join(separator)
            },
            startsWithAmount: function (char) {
                for (let i = 0; i < this.length; i++) {
                    if (this[i] !== char)
                        return i
                }
            },
            endsWithAmount: function (char) {
                let iterations = 0
                for (let i = this.length - 1; i > 0; i--) {
                    if (this[i] !== char)
                        return iterations

                    iterations++
                }
            }
        },

        Number: {
            evenize: function () {
                // snaps to nearest even number
                return Math.round(this / 2) * 2;
            },
            oddize: function () {
                // snaps to nearest odd number
                return Math.round((this - 1) / 2) * 2 + 1;
            },
            fix: function (digits) {
                return parseFloat(this.toFixed(digits))
            },
            floor: function () {
                return Math.floor(this)
            },
            ceil: function () {
                return Math.ceil(this)
            },
            round: function () {
                return Math.round(this)
            },
            clamp: function (min, max) {
                return Math.max(min, Math.min(max, this))
            }
        }
    },
    classes: {
        AdvDate: class {
            #timestamp = ()=>timestamp || Date.now()
            // a more human friendly date API (made by ccjt)
            constructor(timestamp) {
                this.weekNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ];
                this.times = {
                    timestamp: ()=>this.#timestamp(),
                    weekDay: ()=>new Date(this.#timestamp()).getDay() + 1,
                    day: ()=>new Date(this.#timestamp()).getDate(),
                    week: ()=>(new Date(new Date(this.#timestamp()).getFullYear(this.#timestamp()), new Date(this.#timestamp()).getMonth() + 1, 0).getDate()),
                    weekName: ()=>(this.weekNames[new Date(this.#timestamp()).getDay()]),
                    month: ()=>new Date(this.#timestamp()).getMonth() + 1,
                    year: ()=>new Date(this.#timestamp()).getFullYear(),
                    hours: ()=>new Date(this.#timestamp()).getHours() + 1,
                    minutes: ()=>new Date(this.#timestamp()).getMinutes(),
                    seconds: ()=>new Date(this.#timestamp()).getSeconds(),
                    milliseconds: ()=>new Date(this.#timestamp()).getMilliseconds()
                }
                for (let i = 0; i < Object.keys(this.times).length; i++) {
                    const key = Object.keys(this.times)[i]
                    const value = Object.values(this.times)[i]
                    this[key] = value
                }
            }

            getDateString(trimWeek = false, showWeek = true, monthFirst = true, timeFirst = false, showMs = false, dateSeparator = '/', timeSeparator = ':', msSeparator = '.') {
                // this code could most likely be compressed into 1 or 2 strings. please do once you figure out how, i beg of you

                if (monthFirst)
                    if (timeFirst)
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''} ${[this.times.month().toString().padStart(2, '0'), this.times.day().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)}`
                    else
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.month().toString().padStart(2, '0'), this.times.day().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)} ${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''}`
                else
                    if (timeFirst)
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''} ${[this.times.day().toString().padStart(2, '0'), this.times.month().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)}`
                    else
                        return `${showWeek ? (`${trimWeek ? this.times.weekName().substring(0, 3) : this.times.weekName()} `) : ''}${[this.times.day().toString().padStart(2, '0'), this.times.month().toString().padStart(2, '0'), this.times.year().toString().padStart(4, '0')].join(dateSeparator)} ${[this.times.hours().toString().padStart(2, '0'), this.times.minutes().toString().padStart(2, '0'), this.times.seconds().toString().padStart(2, '0')].join(timeSeparator)}${showMs ? `${msSeparator}${this.times.milliseconds().toString().padStart(3, '0')}` : ''}`
            }
        }
    },
    expand: ({override = true, skipProtos = false, skipGlobals = false, skipClasses = false} = {}) => {
        const globals = protoplus.global
        const prototypes = protoplus.proto
        const classes = protoplus.classes

        const startTime = now

        // iter globals
        for (let i = 0; i < Object.keys(globals).length; i++) {
            if (skipGlobals) break; // skip expansion if told to

            const key = Object.keys(globals)[i]
            const defs = Object.values(globals)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment

            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                // store snapshot if definition already exists
                if (name in globalThis[key]) {
                    protoplus.snapshots[`global.${key}.${name}`] = globalThis[key][name]
                    if (!override) continue; // skip definition if override is false
                }

                globalThis[key][name] = def
            }
        }

        // iter protos
        for (let i = 0; i < Object.keys(prototypes).length; i++) {
            if (skipProtos) break; // skip expansion if told to

            const key = Object.keys(prototypes)[i]
            const defs = Object.values(prototypes)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment

            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]
                // store snapshot if definition already exists
                if (name in globalThis[key].prototype) {
                    if (
                        `prototype.${key}.${name}` in protoplus.snapshots
                        &&
                        protoplus.snapshots[`prototype.${key}.${name}`] ===
                    )
                    protoplus.snapshots[`prototype.${key}.${name}`] = globalThis[key].prototype[name]
                    if (!override) continue; // skip definition if override is false
                }

                globalThis[key].prototype[name] = def
            }
        }
        
        // def classes
        for (let i = 0; i < Object.keys(classes).length; i++) {
            if (skipClasses) break; // skip expansion if told to

            const className = Object.keys(classes)[i]
            const classDef = Object.values(classes)[i]

            if (className in globalThis) {
                // add to snapshots and skip definition if it already exists,
                // regardless of override

                protoplus.snapshots[`value.${className}`] = true // use true for existence
                continue;
            }

            globalThis[className] = classDef
        }
        const endTime = now
        console.log(`expanded methods in ${endTime - startTime}ms`)
    },
    contract: ({forceErase = false, skipProtos = false, skipGlobals = false, skipClasses = false} = {}) => {
        const globals = protoplus.global
        const prototypes = protoplus.proto
        const classes = protoplus.classes

        const startTime = now

        // iter globals
        for (let i = 0; i < Object.keys(globals).length; i++) {
            if (skipGlobals) break; // skip contraction if told to
            const key = Object.keys(globals)[i]
            const defs = Object.values(globals)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment
           
            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                // delete definition if erasing is forced or there is no snapshot
                if (forceErase || !protoplus.snapshots[`global.${key}.${name}`])
                    delete globalThis[key][name]
                else
                    globalThis[key][name] = protoplus.snapshots[`global.${key}.${name}`]
            }
        }

        // iter protos
        for (let i = 0; i < Object.keys(prototypes).length; i++) {
            if (skipProtos) break; // skip contraction if told to
            
            const key = Object.keys(prototypes)[i]
            const defs = Object.values(prototypes)[i]

            if (!globalThis[key]) continue // skip if the parent doesn't exist in this environment

            // def funcs
            for (let i = 0; i < Object.keys(defs).length; i++) {
                const name = Object.keys(defs)[i]
                const def = Object.values(defs)[i]

                // delete definition if erasing is forced or there is no snapshot
                if (forceErase || !protoplus.snapshots[`prototype.${key}.${name}`])
                    delete globalThis[key].prototype[name]
                else
                    globalThis[key].prototype[name] = protoplus.snapshots[`prototype.${key}.${name}`]
            }
        }
        
        // def classes
        for (let i = 0; i < Object.keys(classes).length; i++) {
            if (skipClasses) break; // skip contraction if told to
            
            const className = Object.keys(classes)[i]

            // skip deletion if there's a snapshot of it set to `true`,
            // regardless if deletion is forced
            if (`value.${className}` in protoplus.snapshots && protoplus.snapshots[`value.${className}`] === true) continue

            delete globalThis[className]
        }
        const endTime = now
        console.log(`contracted methods in ${endTime - startTime}ms`)
    },
    version: '1.0.0'
}

console.log(`proto+ v${protoplus.version} loaded!`)


export { protoplus }
