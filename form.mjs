// @ts-check

import getRandomConjugation from './scrap/verbi-italiani.com.mjs'

/** 
 * @typedef Alts 
 * @property {string[]} time
 * @property {string[]} frequency
 * @property {string[]} done
 * @property {string[]} mode
 * @property {string[]} tone
 */

/** 
 * @typedef Variant 
 * @property {string=} time
 * @property {string=} frequency
 * @property {string=} done
 * @property {string=} mode
 * @property {string=} tone
 */



/** @type [Alts, string][] */
const indicativo = ([

    [{

        time: ['presente'],
        frequency: ['unico', 'ripetuto', 'continuo'],
        done: ['non specificato'],
    
        mode: ['certo', 'aforismo'],
        tone: ['conversazione', 'narrazione']
    
    }, 'presente'],

    [{

        time: ['futuro'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['conversazione']
    }, 'presente'],

    [{

        time: ['passato'],
        frequency: ['ripetuto'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['conversazione', 'narrazione']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['irrealtà'],
        tone: ['conversazione']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['gentilezza']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['causalità']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['futuro'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo', 'possibile'],
        tone: ['conversazione']
    
    }, 'futuro semplice'],
    
    [{

        time: ['presente'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['comando']
    
    }, 'futuro semplice'],
    
    [{

        time: ['futuro anteriore'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['certo'],
        tone: ['conversazione']
    
    }, 'futuro anteriore'],
    
    [{

        time: ['passato prossimo', 'passato oggi'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['conversazione']
    
    }, 'passato prossimo'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['certo'],
        tone: ['conversazione', 'aforismo']
    
    }, 'passato remoto'],
    
    [{

        time: ['trapassato'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['certo'],
        tone: ['conversazione']
    
    }, 'trapassato prossimo'],
    
    [{

        time: ['trapassato'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['certo'],
        tone: ['conversazione']
    
    }, 'trapassato remoto'],

])

/** @type [Alts, string][] */
const congiuntivo = ([

    [{

        time: ['presente'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'presente'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['non specificato'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'passato'],
    
    [{

        time: ['trapassato'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'trapassato'],

    [{

        time: ['trapassato'],
        frequency: ['unico', 'ripetuto'],
        done: ['non specificato'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'imperfetto']
])

/** @type [Alts, string][] */
const condizionale = ([

    [{

        time: ['presente'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['condizionale'],
        tone: ['conversazione']
    
    }, 'presente'],

    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['condizionale'],
        tone: ['conversazione']
    
    }, 'passato']
])


/** @type {[Alts, string][]} *///@ts-ignore
const alts = ([ 
    ...indicativo.map(([alt, name]) => [alt, `indicativo ${name}`]),
    ...congiuntivo.map(([alt, name]) => [alt, `congiuntivo ${name}`]), 
    ...condizionale.map(([alt, name]) => [alt, `condizionale ${name}`]) 
])


/** @param {Variant} variant */
function getAvaibleAlts(variant) {

    const props = Object.keys(variant)
    if (props.length == 0)
        return alts

    return alts
        .filter(([alt]) => !props.some(prop => !alt[prop].includes(variant[prop])))
}


/** @param {HTMLInputElement[]} inputs */
function autoCheckLast(inputs) {

    for (const prop of ['time', 'frequency', 'done', 'mode', 'tone']) {

        const checked = inputs.filter(x => x.name == prop)
        for (const input of checked) {

            const isAvaible = !input.hasAttribute('disabled')
            const isUnique = checked.filter(x => x !== input)
                .every(x => x.hasAttribute('disabled'))

            if (isAvaible && isUnique)
                input.checked = true
        }
    }
}


/** @param {HTMLSelectElement} select */
function autoSelect(select) {

    if (select.value)
        return

    if (select.options.length == 1)
        select.value = select.options[0].value
    else if (select.options.length == 2)
        select.value = select.options[1].value
}


/**  
 * @param {HTMLInputElement[]} inputs
 * @param {HTMLSelectElement} select
 */
function handleInputs(inputs, select) {

    /** @type Variant */
    const variant = {}
    for (const input of inputs) if (input.checked)
        variant[input.name] = input.value

    const alts = getAvaibleAlts(variant)
    for (const input of inputs) {

        const isInAvaibleAlt = alts.some(([alt]) => alt[input.name].includes(input.value))
        if (isInAvaibleAlt)
            input.removeAttribute('disabled')
        else
            input.setAttribute('disabled', 'disabled')
    }
    
    autoCheckLast(inputs)

    const names = [...new Set(alts.map(([_, name]) => name))]
    const placeholder = "<option value='' disabled selected>qualsiasi</option>"
    const selected = select.value
    select.innerHTML = names.reduce((acc, name, i) => `${acc}<option value="${name}">${name}</option>`, placeholder)

    if (selected && Array.from(select.options).some(opt => opt.value == selected))
        select.value = selected
    else
        autoSelect(select)
}


/**
 * @param {HTMLSelectElement} select 
 * @param {HTMLInputElement[]} inputs
 */
function handleSelect(select, inputs) {

    if (select.value == '')
        return

    /** @type Variant */
    const variant = {}
    for (const input of inputs) if (input.checked)
        variant[input.name] = input.value

    const alts = getAvaibleAlts(variant)
    const [_, name] = alts.filter(([_, name]) => name == select.value)

    const avaible = alts
        .filter(([alt, key]) => key == select.value).map(([alt]) => alt)
        .reduce((acc, alt) => ({

            time: [...new Set([...acc.time, ...alt.time])],
            frequency: [...new Set([...acc.frequency, ...alt.frequency])],
            done: [...new Set([...acc.done, ...alt.done])],

            mode: [...new Set([...acc.mode, ...alt.mode])],
            tone: [...new Set([...acc.tone, ...alt.tone])]

        }), { time: [], frequency: [], done: [], mode: [], tone: [] })

    for (const input of inputs) {

        const isInAvaibleAlt = avaible[input.name].includes(input.value)
        if (isInAvaibleAlt)
            input.removeAttribute('disabled')
        else
            input.setAttribute('disabled', 'disabled')
    }

    autoCheckLast(inputs)
    handleInputs(inputs, select)
}


/** 
 * @param {Event} event
 * @param {HTMLInputElement[]} inputs
 * @param {HTMLSelectElement} select
 */
function reset(event, inputs, select) {
                
    /** @type HTMLButtonElement *///@ts-ignore
    const btn = event.target
    /** @type Element *///@ts-ignore
    const container = btn.parentElement?.parentElement
    for (const input of container.querySelectorAll('input')) {

        input.checked = false
        input.removeAttribute('disabled')
    }

    select.value = ''
    handleInputs(inputs, select)
}


/** 
 * @param {string} name 
 * @param {HTMLOutputElement} container 
 */
async function outputExample(name, container) {

    if (!name)
        return

    const [verb, conjugations] = await getRandomConjugation()

    /** @type [string, string][] *///@ts-ignore
    const conj = conjugations[name]

    container.innerHTML = verb + '<br>' + conj.join('<br>')
}


/** @param {Element} container */
export default function(container) {

    /** @type {HTMLSelectElement} *///@ts-ignore
    const select = container.querySelector('select')
    /** @type {HTMLOutputElement} *///@ts-ignore
    const output = container.querySelector('output')
    select.addEventListener('change', () => {

        handleSelect(select, inputs)
        outputExample(select.value, output)
    })

    const query = '[name=time],[name=frequency],[name=done],[name=mode],[name=tone]'
    /** @type {HTMLInputElement[]} */
    const inputs = Array.from(container.querySelectorAll(query))    
    /** @param {Event | null} event */
    const inputHandler = (event = null) =>
        handleInputs(inputs, select)

    inputHandler()
    autoSelect(select)
    for (const input of inputs)
        input.addEventListener('input', inputHandler)

    /** @param {Event} event */
    const resetHandler = (event) =>
        reset(event, inputs, select)    
    for (const btn of container.querySelectorAll('button[name="reset"]'))
        btn.addEventListener('click', resetHandler)

    if (select.value)
        outputExample(select.value, output)
}