import { useUserContext } from '../lib/contexts';
import { getOverhead, getPoll, getPollsByUser, resetVoterAnswers, setCurrentPoll, setPoll } from '../lib/firebaseMethods';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import _ from 'underscore';

export default function Admin() {

    const [polls, setPolls] = useState();
    const [pollForms, setPollForms] = useState({});
    const [updatedForm, setUpdatedForm] = useState({});
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
                        reset: 'Reset Answers',
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

            swapButtonText(pollId, 'reset', '✅', 'Reset Answers');
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
                question: updatedForm.question || pollForms[pollId].question,
                answers: updatedForm.answers || pollForms[pollId].answers,
                maxchoices: updatedForm.maxchoices || pollForms[pollId].maxchoices || 1
            }
            setPoll(data);

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

    function updateForm({ pollId, fieldName, index }) {
        return event => {
            event.preventDefault();

            console.log('updateForm', fieldName, event.target.value);

            if (!pollId || !fieldName) {
                return
            }

            const updated = _.clone({
                ...pollForms[pollId],
                answers: _.clone(pollForms[pollId].answers)
            })

            if (fieldName === 'answers') {
                updated.answers[index] = event.target.value;
            } else {
                updated[fieldName] = event.target.value;
            }

            console.log('updated', updated);

            setUpdatedForm({
                ...updated
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
                return <div data-poll-id={pollId} key={pollId} className={clsx("bg-white p-8 border-4 rounded-xl max-w-3xl border-transparent bg-white")}>
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <h3>Text</h3>
                            <input
                                onChange={updateForm({ pollId, fieldName: 'question' })}
                                className="w-full border border-neutral-400 rounded-lg p-2" type="text" defaultValue={form.question} />

                            <h3 className="mt-4">Answers</h3>

                            {form.answers && form.answers.map((answer, index) => {
                                return <div key={`${form.question}_${answer}_${index}`} className="mt-1">
                                    <input
                                        onChange={updateForm({ pollId, fieldName: 'answers', index })}
                                        className="w-full border border-neutral-400 rounded-lg p-2"
                                        type="text" defaultValue={answer}></input>
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
                            <div className="">
                                <button onClick={savePoll(pollId)} className="px-4 text-blue-400 hover:text-blue-600 transition duration-200 rounded-lg">
                                    {form.buttonTexts.save}
                                </button>
                                <button onClick={reset(pollId)} className="px-4 text-neutral-400  hover:text-neutral-700 transition duration-200 rounded-lg">
                                    {form.buttonTexts.reset}
                                </button>
                            </div>

                            <button onClick={sendToAudience(pollId)} className={clsx("w-40 h-12 border-2 border-pink-200 text-pink-200 hover:border-pink-600 hover:text-pink-600 transition duration-200 rounded-lg", currentPollId === pollId && "bg-pink-500 border-pink-500 text-pink-100 hover:text-pink-200")}>
                                {currentPollId === pollId ? <>With Audience</> : <>To Audience</>}
                            </button>

                            <button onClick={sendToOverhead(pollId)} className={clsx("w-40 h-12 border-2 border-purple-200 text-purple-200 hover:border-purple-600 hover:text-purple-600 transition duration-200 rounded-lg", currentOverheadPollId === pollId && "bg-purple-500 border-purple-500 text-purple-200 hover:text-purple-100")}>
                                {currentOverheadPollId === pollId ? <>With Overhead</> : <>To Overhead</>}
                            </button>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}