import { useEffect, useState } from "react";
import { useInterval } from "../lib/hooks";
import { getOverhead, getPoll } from "../lib/firebaseMethods";
import _ from "underscore";

const INTERVAL_REFRESHING_OVERHEAD = 3000;

export default function ({ currentPollId }) {
    const [poll, setPoll] = useState()
    const [votedAnswers, setVotedAnswers] = useState()
    const [totalResponses, setTotalReponses] = useState()

    useEffect(() => {
        if (poll) {
            const votedAnswers = {};
            let total = 0;

            _.sortBy(poll.answers).map(answer => {
                const totalVotes = Object.keys((poll.voterAnswers && poll.voterAnswers[answer]) || {}).length;
                total += totalVotes;
                votedAnswers[answer] = totalVotes;
            })

            setVotedAnswers(votedAnswers);
            setTotalReponses(total);
        }
    }, [poll])

    useEffect(async () => {
        const pollData = await getPoll({ pollId: currentPollId });
        setPoll(pollData);
    }, []);

    useInterval(async () => {
        const pollData = await getPoll({ pollId: currentPollId });
        setPoll(pollData);
    }, INTERVAL_REFRESHING_OVERHEAD);

    return <div className="min-h-screen bg-black">
        {poll && poll.answers && poll.answers.length === 0 &&
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="text-white text-5xl">
                    {poll.question}
                </div>
            </div>}

        {poll && poll.answers && poll.answers.length > 0 && <>
            <header className="py-7 px-4 bg-neutral-900 text-white text-center text-5xl">
                <div className="flex items-center justify-between">
                    <div className="text-left">{poll.question}</div>
                    <div className="text-right text-neutral-400">Total responses: {totalResponses}</div>
                </div>
            </header>

            <div className="p-4 grid grid-cols-1 gap-2">
                {_.sortBy(poll.answers).map((answer) => {
                    const counter = votedAnswers && votedAnswers[answer];
                    const percentage = votedAnswers && votedAnswers[answer] && `${(votedAnswers[answer] / totalResponses * 100).toFixed(1)}%` || 0;

                    return <div key={answer} className="relative mt-1 block w-full py-4 px-2 text-green-300 border-2 border-green-600 rounded-lg text-3xl text-center">
                        <div className="relative z-10 flex items-center justify-center">
                            <span className="">{answer}</span>
                            {counter > 0 &&
                                <div className="absolute top-0 right-2 z-10 ml-2 text-white text-3xl flex items-center justify-center">
                                    {counter} responses • {percentage}
                                </div>}
                        </div>
                        {counter > 0 &&
                            <div className="absolute top-0 left-0 h-full bg-emerald-800 z-0"
                                style={{ width: percentage }}>
                            </div>}
                    </div>
                })}
            </div>
        </>}
    </div>
}


export async function getServerSideProps(context) {
    let currentPollId;
    let eventId = 1;

    if (eventId) {
        const overheadData = await getOverhead({ eventId });
        currentPollId = overheadData?.currentPollId;
    }

    return {
        props: {
            eventId,
            currentPollId
        }
    }
}