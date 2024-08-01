import { useEffect, useState } from "react";
import { useInterval } from "../../lib/hooks";
import { getOverhead, getPoll } from "../../lib/firebaseMethods";

const INTERVAL_REFRESHING_OVERHEAD = 2000000;

export default function ({ eventId, poll, currentPollId }) {
    const [pollResults, setPollResults] = useState()

    useInterval(async () => {
        const pollResultData = await getPollResults({ currentPollId });
    }, INTERVAL_REFRESHING_OVERHEAD);

    return <div className="min-h-screen bg-black">
        {poll && Object.entries(poll.answers).length === 0 &&
            <div className="min-h-screen min-w-screen flex items-center justify-center">
                <div className="text-white text-5xl">
                    {poll.question}
                </div>
            </div>}

        {poll && Object.entries(poll.answers).length > 0 && <>
            <header className="py-7 px-4 bg-neutral-900 text-white text-center text-5xl">
                <div className="flex items-center justify-between">
                    <div className="text-left">{poll.question}</div>
                    {/* <div className="text-right text-neutral-400">Total responses: {totalResponses}</div> */}
                </div>
            </header>

            <div className="p-4 grid grid-cols-1 gap-2">
                {Object.entries(poll.answers).map(([answer]) => {
                    // const choice = poll.choices[key];
                    // const percentage = answerCounter && answerCounter[choice] && `${(answerCounter[choice] / totalResponses * 100).toFixed(1)}%` || 0;
                    // const counter = answerCounter && answerCounter[choice];
                    return <div key={answer} className="relative mt-1 block w-full py-4 px-2 text-green-300 border-2 border-green-600 rounded-lg text-3xl text-center">
                        <div className="relative z-10 flex items-center justify-center">
                            <span className="">{answer}</span>
                            {/* {counter &&
                                <div className="absolute top-0 right-2 z-10 ml-2 text-white text-3xl flex items-center justify-center">
                                    {counter} responses • {percentage}
                                </div>} */}
                        </div>
                        {/* {counter &&
                            <div className="absolute top-0 left-0 h-full bg-emerald-800 z-0"
                                style={{ width: percentage }}>
                            </div>} */}
                    </div>
                })}
            </div>

        </>}
    </div>
}


export async function getServerSideProps(context) {
    const eventId = context.params.eventId;
    let currentPollId, poll;

    if (eventId) {
        const overheadData = await getOverhead({ eventId });
        currentPollId = overheadData?.currentPollId;

        if (currentPollId) {
            poll = await getPoll({ pollId: currentPollId })
        }
    }

    return {
        props: {
            eventId,
            poll,
            currentPollId
        }
    }
}