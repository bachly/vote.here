import { getOverhead, getPoll, setVoterAnswers } from "../../lib/firebaseMethods";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import _ from "underscore";
import { useInterval } from "../../lib/hooks";

const INTERVAL_REFRESHING_VOTING_SLIP = 3000;

export default function ({ voterId }) {
    const [poll, setPoll] = useState();
    const [currentPollId, setCurrentPollId] = useState();
    const [currentAnswers, setCurrentAnswers] = useState({});

    useEffect(async () => {
        await retrievePoll();
    }, [])

    useEffect(() => {
        const preAnswers = {}

        // if (poll && poll.voterAnswers) {
        //     Object.entries(_poll.voterAnswers).map(([answer, voters]) => {
        //         if (_.contains(Object.keys(voters), voterId)) {
        //             voterAnswers.push(answer);
        //         }
        //     })
        // }

        if (poll && poll.voterAnswers) {
            Object.entries(poll.voterAnswers).map(([answer, voters]) => {
                if (_.contains(Object.keys(voters), voterId)) {
                    preAnswers[answer] = true;
                }
            })
            setCurrentAnswers(preAnswers);
        }
    }, [poll])

    async function retrievePoll() {
        let currentPollId = null, _poll = {}, voterAnswers = [];

        console.log('retrieve poll');

        const overheadResult = await getOverhead({ eventId: "1" });
        currentPollId = overheadResult.currentPollId;

        if (currentPollId) {
            _poll = await getPoll({ pollId: currentPollId })
        }

        if (_poll) {
            // clear empty elements
            _poll.answers = _.compact(_poll.answers);
        }

        setCurrentPollId(currentPollId);
        setPoll(_poll);
    }

    useInterval(async () => {
        await retrievePoll();
    }, INTERVAL_REFRESHING_VOTING_SLIP)

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

            console.log('voter answers', answers);
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

    return {
        props: {
            voterId,
        }
    }
}