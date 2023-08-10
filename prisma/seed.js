const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const WORDS = require('../lib/words.json');
const _ = require('underscore');

async function main() {
    const form0 = await prisma.form.create({
        data: {
            formId: "0",
            text: "Audience Survey",
            choices: {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
                9: null
            },
            maxchoices: 1,
            status: 'active'
        }
    })

    const form1 = await prisma.form.create({
        data: {
            formId: "1",
            text: "Do you speak & understand Spanish?",
            choices: {
                0: "Yes",
                1: "No",
                2: null,
                3: null,
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
                9: null
            },
            maxchoices: 1,
            status: 'inactive'
        }
    })

    const form2 = await prisma.form.create({
        data: {
            formId: "2",
            text: "Which continent were you born?",
            choices: {
                0: "North America",
                1: "South America",
                2: "Central America",
                3: "Africa",
                4: "Europe",
                5: "Asia",
                6: "Middle East",
                7: "Pacific Islands",
                8: "Australia NZ",
                9: null
            },
            maxchoices: 1,
            status: 'inactive'
        }
    })

    const form3 = await prisma.form.create({
        data: {
            formId: "3",
            text: "What's best describing you?",
            choices: {
                0: "Born in South America",
                1: "Visited South America",
                2: "Want to visit South America",
                3: "Want to live in South America",
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
                9: null,
            },
            maxchoices: 2,
            status: 'inactive'
        }
    })

    const form4 = await prisma.form.create({
        data: {
            formId: "4",
            text: "Which soccer team do you support?",
            choices: {
                0: "Argentina",
                1: "Brazil",
                2: "Columbia",
                3: "Chile",
                4: "Uruguay",
                5: null,
                6: null,
                7: null,
                8: null,
                9: null,
            },
            maxchoices: 2,
            status: 'inactive'
        }
    })

    const form5 = await prisma.form.create({
        data: {
            formId: "5",
            text: "What country would you travel to?",
            choices: {
                0: "Peru",
                1: "Ecuador",
                2: "Cuba",
                3: "Mexico",
                4: "Chile",
                5: null,
                6: null,
                7: null,
                8: null,
                9: null,
            },
            maxchoices: 2,
            status: 'inactive'
        }
    })

    // creating unique 1000+ users with 3-letter english words
    WORDS.map(async word => {
        const entry = await prisma.entry.create({
            data: {
                username: word,
                form1Answer: [],
                form2Answer: [],
                form3Answer: [],
                form4Answer: [],
                form5Answer: [],
                form6Answer: [],
                form7Answer: [],
                form8Answer: [],
                form9Answer: [],
                form10Answer: [],
            }
        })
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })