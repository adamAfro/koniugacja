// @ts-check
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
        done: ['nonfinito'],
    
        mode: ['certo', 'aforismo'],
        tone: ['conversazione', 'narrazione']
    
    }, 'presente indicativo'],

    [{

        time: ['futuro'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['certo'],
        tone: ['conversazione']
    }, 'presente indicativo'],

    [{

        time: ['passato'],
        frequency: ['ripetuto'],
        done: ['nonfinito'],
    
        mode: ['certo'],
        tone: ['conversazione', 'narrazione']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['irrealtà'],
        tone: ['conversazione']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['certo'],
        tone: ['gentilezza']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['certo'],
        tone: ['causalità']
    
    }, 'l\'imperfetto'],
    
    [{

        time: ['futuro'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['certo', 'possibile'],
        tone: ['conversazione']
    
    }, 'futuro semplice'],
    
    [{

        time: ['presente'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
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
        done: ['nonfinito'],
    
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
        done: ['nonfinito'],
    
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

        time: ['futuro'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'futuro congiuntivo'],

    [{

        time: ['presente'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'presente congiuntivo'],
    
    [{

        time: ['passato'],
        frequency: ['unico'],
        done: ['nonfinito'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'passato congiuntivo'],
    
    [{

        time: ['trapassato'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['congiuntivo'],
        tone: ['conversazione']
    
    }, 'trapassato congiuntivo']
])

/** @type [Alts, string][] */
const condizionale = ([

    [{

        time: ['presente'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['condizionale'],
        tone: ['conversazione']
    
    }, 'presente condizionale'],

    [{

        time: ['futuro'],
        frequency: ['unico'],
        done: ['finito'],
    
        mode: ['condizionale'],
        tone: ['conversazione']
    
    }, 'futuro condizionale']
])


const alts = ([ ...indicativo, ...congiuntivo, ...condizionale ])


/** @param {Variant} variant */
function getAvaibleAlts(variant) {

    const props = Object.keys(variant)
    if (props.length == 0)
        return alts

    return alts
        .filter(([alt]) => !props.some(prop => !alt[prop].includes(variant[prop])))
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

    const names = alts.map(([_, name]) => name)
    const placeholder = "<option value='' selected>qualsiasi</option>"
    select.innerHTML = names.reduce((acc, name, i) => `${acc}<option value="${i}">${name}</option>`, placeholder)
}


function handleSelect(select, inputs) {

    if (select.value == '')
        return

    /** @type Variant */
    const variant = {}
    for (const input of inputs) if (input.checked)
        variant[input.name] = input.value

    const alts = getAvaibleAlts(variant)
    const [selected] = alts[select.value]

    for (const input of inputs) {

        const isInAvaibleAlt = selected[input.name].includes(input.value)
        if (isInAvaibleAlt)
            input.removeAttribute('disabled')
        else
            input.setAttribute('disabled', 'disabled')
    }
}


/** @param {Element} container */
export default function(container) {

    const query = '[name=time],[name=frequency],[name=done],[name=mode],[name=tone]'
    /** @type {HTMLInputElement[]} */
    const inputs = Array.from(container.querySelectorAll(query))
    /** @type {HTMLSelectElement} *///@ts-ignore
    const select = container.querySelector('select')


    select.addEventListener('change', () => handleSelect(select, inputs))


    /** @param {Event | null} event */
    const inputHandler = (event = null) =>
        handleInputs(inputs, select)

    inputHandler()
    
    for (const input of inputs)
        input.addEventListener('input', inputHandler)


    /** @param {Event} event */
    const reset = (event) => {
                
        /** @type HTMLButtonElement *///@ts-ignore
        const btn = event.target
        /** @type Element *///@ts-ignore
        const container = btn.parentElement
        for (const input of container.querySelectorAll('input')) {

            input.checked = false
            input.removeAttribute('disabled')
        }

        handleInputs(inputs, select)
    }
    
    for (const btn of container.querySelectorAll('button[name="reset"]'))
        btn.addEventListener('click', reset)
}