// @ts-check

function randWeighted(spec, r = Math.random()) {

    let sum = 0
    for (const i in spec) {
        
        sum += spec[i]
        if (r <= sum)
            return { [i]: spec[i] }
    }

    return { [Object.keys(spec)[0]]: Object.values(spec)[0] }
}

function randInt(min = 0, max = 1) {

    return Math.floor(Math.random() * (max - min + 1)) + min
}


/** @param {string} verb */
function getVerbURL(verb, proxy = 'https://api.codetabs.com/v1/proxy/?quest=') {

    return proxy +
        'https://www.italian-verbs.com' +
        '/verbi-italiani' + 
        '/coniugazione.php' + 
        '?verbo=' + verb
}

function getPopularURL(i = 1, proxy = 'https://api.codetabs.com/v1/proxy/?quest=') {
    
    return proxy +
        'https://www.italian-verbs.com' +
        '/verbi-italiani' + 
        '/verbi-italiani-top.php' + 
        '?pg=' + i
}

async function scrapPopularity(page = randInt(1, 10)) {

    const url = getPopularURL(page)
    const html = await fetch(url)
        .then(r => r.text())
    const document = new DOMParser()
        .parseFromString(html, 'text/html')
    
    /** @type HTMLTableSectionElement */// @ts-ignore
    const container = document.getElementById('zebra')
    const rows = Array.from(container.querySelectorAll('tr'))

    /** @param {HTMLTableRowElement} row */
    function row2VerbPop(row) {

        const cells = row.getElementsByTagName('td')
        if (cells.length < 3)
            return null
        
        const verb = cells[1].textContent?.trim()
        const popularity = cells[2].textContent?.trim()
        if (!verb || !popularity)
            return null
        
        return { verb, popularity: parseInt(popularity.replace(/[^0-9]/g, "")) }
    }
    
    /** @type {{verb: string, popularity: number}[]} *///@ts-ignore
    const verbsPop = rows.map(row2VerbPop)
        .filter(x => x !== null)

    return verbsPop
}

/** @param {string} verb */
async function scrapConjugation(verb) {

    const url = getVerbURL(verb)
    const html = await fetch(url)
        .then(r => r.text())
    /** @type Document */
    const document = new DOMParser()
        .parseFromString(html, 'text/html')
    
    const container = document.getElementById('middle')
    if (!container)
        return null

    const subjects = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro']

    const conjugations = {}
    const entries = Array.from(container.getElementsByTagName('tr'))
    const red = '#800000', green = '#009900'
    for (let i = 0, mode = ''; i < entries.length; i++) {

        const entry = entries[i]

        const txt = entry.textContent?.trim() ?? ''
        if (!txt)
            continue
        else if (!entry.hasAttribute('bgcolor') && entry.querySelector('.modo'))
            mode = txt
        else if (entry.getAttribute('bgcolor') == red)
            mode = txt
        else if (entry.getAttribute('bgcolor') == green) {

            const name = `${mode} ${txt}`.toLocaleLowerCase()
            conjugations[name] = entries.slice(i + 1, i + 1 + subjects.length)
                .map(entry => entry.textContent?.trim() ?? '')

            i += subjects.length
        }
    }

    return conjugations
}


export default async function scrapAnyPopular() {

    const verbsPop = await scrapPopularity()
    const verbsPopMap = verbsPop.reduce((a, { verb, popularity}) => ({ ...a, [verb]: popularity} ), {})    
    const verbPopMapEntry = randWeighted(verbsPopMap)
    const verb = Object.keys(verbPopMapEntry)[0]
    const conjugation = await scrapConjugation(verb)

    return [verb, conjugation]
}