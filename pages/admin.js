import { useUserContext } from '../lib/contexts';
import { getOverhead, getPoll, getPollsByUser, resetVoterAnswers, setCurrentPoll, setPoll } from '../lib/firebaseMethods';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import _ from 'underscore';
import { InputSwitch } from 'primereact/inputswitch';

export default function Admin() {

    const [polls, setPolls] = useState();
    const [pollForms, setPollForms] = useState({});
    const [currentPollId, setCurrentPollId] = useState();
    const [currentOverheadPollId, setCurrentOverheadPollId] = useState();

    useEffect(async () => {
        let newPollForms = {};

        const pollsByUser = await getPollsByUser({ email: "admin" })
        console.log('pollsByUser', pollsByUser);
        setPolls(pollsByUser);
        pollsByUser.forEach(poll => {
            newPollForms = {
                ...newPollForms,
                [poll.id]: {
                    ...poll,
                    buttonTexts: {
                        save: 'Save',
                        reset: 'Reset Results',
                        audience: 'Send to audience',
                        overhead: 'Send to overhead'
                    }
                }
            }
        })
        setPollForms(newPollForms);

        const overheadData = await getOverhead({ eventId: "1" });
        setCurrentPollId(overheadData?.currentPollId);
        setCurrentOverheadPollId(overheadData?.currentOverheadPollId);
    }, [])

    useEffect(() => {
        console.log('pollForms', pollForms)
    }, [pollForms])

    function reset(pollId) {
        return event => {
            event.preventDefault();
            resetVoterAnswers({ pollId })

            swapButtonText(pollId, 'reset', '✅', 'Reset Results');
        }
    }

    function sendToAudience(pollId) {
        return event => {
            event.preventDefault();
            setCurrentPoll({ currentPollId: pollId })
            setCurrentPollId(pollId);
        }
    }

    function sendToOverhead(pollId) {
        return event => {
            event.preventDefault();
            setCurrentPoll({ currentOverheadPollId: pollId })
            setCurrentOverheadPollId(pollId);
        }
    }

    function savePoll(pollId) {
        return event => {
            event.preventDefault();
            const data = {
                pollId,
                question: pollForms[pollId].question,
                answers: pollForms[pollId].answers,
                maxchoices: pollForms[pollId].maxchoices || 1
            }
            setPoll(data);

            console.log('Save poll:', data);

            swapButtonText(pollId, 'save', '✅', 'Save');
        }
    }

    function swapButtonText(pollId, name, text1, text2) {
        setPollForms({
            ...pollForms,
            [pollId]: {
                ...pollForms[pollId],
                buttonTexts: {
                    ...pollForms[pollId].buttonTexts,
                    [name]: text1
                }
            }
        })

        setTimeout(() => {
            setPollForms({
                ...pollForms,
                [pollId]: {
                    ...pollForms[pollId],
                    buttonTexts: {
                        ...pollForms[pollId].buttonTexts,
                        [name]: text2
                    }
                }
            })
        }, 500)
    }

    function updateForm({ pollId, fieldName, key }) {
        return event => {
            event.preventDefault();

            if (!pollId || !fieldName) {
                return
            }

            console.log('Update field:', fieldName, event.target.value);

            const newPollForm = {}

            if (fieldName === 'answers') {
                newPollForm.answers = newPollForm.answers || {}
                newPollForm.answers[key] = event.target.value;
            } else {
                newPollForm[fieldName] = event.target.value;
            }

            console.log('Updated', newPollForm);

            setPollForms({
                ...pollForms,
                [pollId]: {
                    ...pollForms[pollId],
                    ...newPollForm,
                    answers: {
                        ...pollForms[pollId].answers,
                        ...newPollForm.answers
                    },
                }
            })
        }
    }

    return <div className="min-h-screen bg-neutral-700">
        <header className="py-2 bg-neutral-800 text-white text-center text-2xl">
            <div className="flex items-center justify-between px-4">
                <div>
                    QR Vote Admin
                </div>
                <div className="flex items-center">
                    <div className="mr-6">
                        <a href="/voting-slips" target="_blank" className="text-neutral-400 text-lg hover:underline hover:text-white">
                            QR Voting Slips
                        </a>
                    </div>
                    <div className="mr-6">
                        <a href="/overhead" target="_blank" className="text-neutral-400 text-lg hover:underline hover:text-white">
                            Overhead
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <div className="p-12 grid grid-cols-3 gap-2">
            {pollForms && Object.entries(pollForms).map(([pollId, form]) => {
                return <div data-poll-id={pollId} key={pollId} className={clsx("bg-white p-8 border-4 rounded-xl max-w-3xl border-transparent")}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <h3>Text</h3>
                            <input
                                onChange={updateForm({ pollId, fieldName: 'question' })}
                                className="w-full border border-neutral-400 rounded-lg p-2" type="text" defaultValue={form.question} />

                            <h3 className="mt-4">Answers</h3>

                            {form.answers && Object.entries(form.answers).map(([key, answer]) => {
                                return <div key={`${form.question}_${key}`} className="mt-1">
                                    <input
                                        onChange={updateForm({ pollId, fieldName: 'answers', key })}
                                        className="w-full border border-neutral-400 rounded-lg p-2"
                                        type="text" value={answer}></input>
                                </div>
                            })}

                            <h3 className="mt-4">Maximum choices</h3>
                            <select
                                onChange={updateForm({ pollId, fieldName: 'maxchoices' })}
                                defaultValue={form.maxchoices}
                                className="w-full border border-neutral-400 rounded-lg p-2">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </select>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <label className="flex items-center">
                                <InputSwitch checked={currentPollId === pollId} onChange={sendToAudience(pollId)} />
                                <div className="ml-2">To audience</div>
                            </label>

                            <label className="flex items-center">
                                <InputSwitch checked={currentOverheadPollId === pollId} onChange={sendToOverhead(pollId)} />
                                <div className="ml-2">To overhead</div>
                            </label>

                            <div className="">
                                <button onClick={reset(pollId)} className="w-32 text-neutral-400  hover:text-neutral-700 transition duration-200 rounded-lg">
                                    {form.buttonTexts.reset}
                                </button>
                                <button onClick={savePoll(pollId)} className="w-20 text-blue-400 hover:text-blue-600 transition duration-200 rounded-lg">
                                    {form.buttonTexts.save}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}