import { getOverhead, getPoll, setVoterAnswers } from "../../lib/firebaseMethods";
import React, { useEffect, useState } from "react";
import _ from "underscore";
import { RadioButton } from "primereact/radiobutton";
import WORDS from "../../lib/words.json";

export default function ({
    voterId,
    poll,
    currentPollId,
    hasAlreadyVoted }) {
    const [currentAnswers, setCurrentAnswers] = useState({});

    if (!_.contains(WORDS, voterId)) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center text-center px-4">Hey, don't cheat! This is an Invalid Voting Slip.</div>;
    }

    function handleSelectAnswer({ answer }) {
        return event => {
            event && event.preventDefault();

            console.log('Select answer', answer);

            let answers = Object.assign({}, currentAnswers);

            Object.entries(answers).map(([key]) => answers[key] = false);
            answers[answer] = true;
            setCurrentAnswers(answers);
        }
    }

    function handleSubmit() {
        return async event => {
            event.preventDefault();
            await setVoterAnswers({ pollId: currentPollId, voterId, voterAnswers: currentAnswers });
            location.reload();
        }
    }

    function isDisabled({ answer }) {
        const selectedAnswers = Object.entries(currentAnswers).filter(([answer, status]) => !!status);
        return selectedAnswers.length >= poll.maxchoices && !currentAnswers[answer]
    }

    function canSubmit() {
        const selectedAnswers = Object.entries(currentAnswers).filter(([answer, status]) => !!status);
        return selectedAnswers.length > 0
    }

    return <div className="min-h-screen bg-black flex flex-col">
        {poll && poll.answers && Object.keys(poll.answers).length === 0 &&
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="text-white text-2xl">
                    {poll.question}
                </div>
            </div>}

        {poll && poll.answers && Object.keys(poll.answers).length > 0 &&
            <div className="flex-1">
                <div className="max-w-xl mx-auto">
                    <header className="px-6 py-3 bg-neutral-900 text-white text-center text-xl">
                        {poll.question}
                    </header>

                    {hasAlreadyVoted ?
                        <div className="text-white text-center py-12">
                            Thank you for voting.
                        </div>
                        :
                        <div>
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-1 gap-2">
                                {Object.entries(poll.answers).map(([index, answer]) => {
                                    if (answer) {
                                        return <div key={answer} className="text-white py-1 text-left">
                                            <RadioButton
                                                inputId={`radio_${index}`} value={answer} checked={currentAnswers[answer] === true} name="voter_answer" onChange={handleSelectAnswer({ answer })} />
                                            <label htmlFor={`radio_${index}`} className="ml-2 disabled:opacity-10" disabled={isDisabled({ answer })}>{answer}</label>
                                        </div>
                                    }
                                })}
                            </div>

                            <div className="px-4">
                                <button
                                    disabled={!canSubmit()}
                                    onClick={handleSubmit()}
                                    className="text-white bg-cyan-600 block w-full max-w-xs mx-auto py-2 px-3 rounded-lg text-xl disabled:opacity-30">Submit</button>
                            </div>
                        </div>}
                </div>
            </div>
        }
    </div>
}

export async function getServerSideProps(context) {
    const voterId = context.params.votingSlipId;
    let currentPollId = null, poll = {};
    let hasAlreadyVoted = false;

    const overheadResult = await getOverhead({ eventId: "1" });
    currentPollId = overheadResult.currentPollId;

    if (currentPollId) {
        poll = await getPoll({ pollId: currentPollId })
    }

    if (poll && poll.voterAnswers) {
        Object.entries(poll.voterAnswers).map(([answer, voters]) => {
            if (_.contains(Object.keys(voters), voterId)) {
                hasAlreadyVoted = true;
            }
        })
    }

    return {
        props: {
            voterId,
            poll,
            currentPollId,
            hasAlreadyVoted
        }
    }
}