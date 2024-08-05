import { getOverhead, getPoll, setVoterAnswers } from "../../lib/firebaseMethods";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import _ from "underscore";

export default function ({ voterId, voterAnswers, poll, currentPollId }) {
    const [currentAnswers, setCurrentAnswers] = useState({});

    console.log('poll', poll)

    useEffect(() => {
        const preAnswers = {}
        voterAnswers.map(voterAnswer => {
            preAnswers[voterAnswer] = true;
        })
        setCurrentAnswers(preAnswers);
    }, [])

    function handleSelectAnswer({ answer }) {
        return event => {
            event && event.preventDefault();

            let answers = Object.assign({}, currentAnswers);
            const selectedAnswers = Object.entries(currentAnswers).filter(([answer, status]) => !!status);

            if (answers[answer]) {
                answers[answer] = false;
            } else {
                if (selectedAnswers.length < poll.maxchoices) {
                    answers[answer] = true;
                }
            }

            setCurrentAnswers(answers);
            setVoterAnswers({ pollId: currentPollId, voterId, voterAnswers: answers });
        }
    }

    function isDisabled({ answer }) {
        const selectedAnswers = Object.entries(currentAnswers).filter(([answer, status]) => !!status);
        return selectedAnswers.length >= poll.maxchoices && !currentAnswers[answer]
    }

    return <div className="min-h-screen bg-black flex flex-col">
        {poll && poll.answers && poll.answers.length === 0 &&
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="text-white text-2xl">
                    {poll.question}
                </div>
            </div>}

        {poll && poll.answers && poll.answers.length > 0 && <div className="flex-1">
            <header className="py-3 bg-neutral-900 text-white text-center text-2xl">
                {poll.question}
            </header>

            <div className="p-4 grid grid-cols-1 lg:grid-cols-1 gap-2">
                {poll.answers.map((answer, index) => {
                    if (!answer) {
                        return <></>;
                    }

                    return <button
                        key={`${answer}_${index}`}
                        onClick={handleSelectAnswer({ answer })}
                        disabled={isDisabled({ answer })}
                        className={clsx(
                            currentAnswers && currentAnswers[answer] ? "text-white bg-blue-600 border-transparent" : "text-neutral-400 border-neutral-400",
                            "mt-1 block w-full py-4 px-3 border-2 rounded-xl text-2xl disabled:opacity-30")}>
                        <span className="ml-2" >{answer}</span>
                    </button>
                })}
            </div>
        </div>}
    </div >

}

export async function getServerSideProps(context) {
    const voterId = context.params.votingSlipId;
    let currentPollId = null, poll = null;

    const overheadResult = await getOverhead({ eventId: "1" });
    currentPollId = overheadResult.currentPollId;

    if (currentPollId) {
        poll = await getPoll({ pollId: currentPollId })
    }

    // clear empty elements
    poll.answers = _.compact(poll.answers);

    const voterAnswers = [];
    Object.entries(poll.voterAnswers).map(([answer, voters]) => {
        if (_.contains(Object.keys(voters), voterId)) {
            voterAnswers.push(answer);
        }
    })

    return {
        props: {
            voterId,
            voterAnswers,
            poll,
            currentPollId
        }
    }
}