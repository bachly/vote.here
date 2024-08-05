import useAxios from 'axios-hooks';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import clsx from 'clsx';
import { useInterval } from '../../lib/hooks';
import _ from 'underscore';
import WORDS from '../../lib/words.json';

export default function ({ data }) {
    const { username } = data;

    if (WORDS.indexOf(username) < 0) {
        return <div className="bg-black text-white text-3xl h-screen w-screen flex items-center justify-center">Invalid link</div>
    }

    const [activeForm, setActiveForm] = useState();
    const [currentAnswers, setCurrentAnswers] = useState({});

    function handleSelectAnswer({ choice }) {
        return event => {
            event && event.preventDefault();

            let answers = Object.assign({}, currentAnswers);

            if (answers[choice]) {
                delete answers[choice];
            } else {
                if (Object.keys(answers).length < activeForm.maxchoices) {
                    answers[choice] = true;
                }
            }

            setCurrentAnswers(answers);

            const answersArray = [];
            Object.keys(answers).map(key => {
                if (key) {
                    answersArray.push(key);
                }
            })

            axios.post('/api/submit-vote', {
                username,
                formId: activeForm.formId,
                answer: answersArray
            })
        }
    }

    function isDisabled({ choice }) {
        return Object.keys(currentAnswers).length >= activeForm.maxchoices && !currentAnswers[choice]
    }

    useEffect(() => {
        if (activeForm) {
            const answersToUpdate = {};

            axios.get(`/api/get-entry?username=${username}`).then(({ data }) => {
                const answers = data.result[`form${activeForm.formId}Answer`];
                console.log('retrieved answers:', answers);
                if (answers && answers.length > 0) {
                    answers.map(answer => {
                       answersToUpdate[answer] = true;
                    })
                }

                console.log('answers to update:', answersToUpdate);
                setCurrentAnswers(answersToUpdate);
            })
        }
    }, [activeForm])

    function getActiveForm() {
        axios.get('/api/get-forms?status=active').then(({ data }) => {
            setActiveForm(data.result[0]);
        })
    }

    useEffect(() => {
        getActiveForm();
    }, [])

    useInterval(() => {
        getActiveForm();
    }, 2000)

    return <div className="min-h-screen bg-black">
        {activeForm && parseInt(activeForm.formId) === 0 &&
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="text-white text-2xl">
                    {activeForm.text}
                </div>
            </div>}

        {activeForm && parseInt(activeForm.formId) > 0 && <>
            <header className="py-3 bg-neutral-900 text-white text-center text-2xl">
                {activeForm.text}
            </header>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-1 gap-2">
                {Object.keys(activeForm.choices).map(key => {
                    const choice = activeForm.choices[key];
                    if (choice) {
                        return <button
                            key={key}
                            onClick={handleSelectAnswer({ choice })}
                            disabled={isDisabled({ choice })}
                            className={clsx(
                                currentAnswers && currentAnswers[choice] ? "text-white bg-blue-600 border-transparent" : "text-blue-300 border-blue-600",
                                "mt-1 block w-full py-4 px-3 border-2  text-blue-300 rounded-lg text-2xl disabled:opacity-30")}>
                            <span className="ml-2" >{choice}</span>
                        </button>
                    }
                })}
            </div>

        </>}
    </div >
}

export async function getServerSideProps({ params }) {
    const username = params.id;

    if (username) {
        return {
            props: {
                data: {
                    username
                }
            }
        }
    } return {
        props: {
            data: {
                error: true
            }
        }
    }
}