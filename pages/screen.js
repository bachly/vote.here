import useAxios from 'axios-hooks';
import { useInterval } from '../lib/hooks';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

export default function () {
    const [activeForm, setActiveForm] = useState();

    const [{ data: entries, loading: isFetchingEntries, error: errorFetchingEntries }, refetchEntries] = useAxios(
        '/api/get-entries'
    )

    function handleSubmitForm(formId) {

    }

    useEffect(() => {
        axios.get('/api/get-forms?status=active').then(({ data }) => {
            setActiveForm(data.result[0]);
        })
    })

    useInterval(() => {
        axios.get('/api/get-forms?status=active').then(({ data }) => {
            setActiveForm(data.result[0]);
        })
    }, 5000);

    return <div className="">
        {activeForm && <>
            <header className="py-2 bg-neutral-900 text-white text-center text-2xl">
                {activeForm.text}
            </header>

            <div className="p-4">
                <form onSubmit={handleSubmitForm(1)}>
                    {Object.keys(activeForm.choices).map(key => {
                        const choice = activeForm.choices[key];
                        if (choice) {
                            return <label key={key} className="mt-1 block w-full py-3 px-2 border border-neutral-500 rounded-lg">
                                <input type="checkbox" value={choice} name={`radioForForm${activeForm.formId}`} />
                                <span className="ml-2">{choice}</span>
                            </label>
                        }
                    })}

                    <button className="mt-4 py-3 px-4 text-center bg-blue-500 hover:bg-blue-600 text-white w-full rounded-lg">Submit</button>
                </form>
            </div>

        </>}
    </div>
}

export async function getServerSideProps({ params }) {
    return {
        props: {

        }
    }
}