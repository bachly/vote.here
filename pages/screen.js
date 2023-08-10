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
    }, [])

    useInterval(() => {
        axios.get('/api/get-forms?status=active').then(({ data }) => {
            setActiveForm(data.result[0]);
        })
    }, 5000);

    return <div className="min-h-screen bg-black">
        {activeForm && <>
            <header className="py-3 bg-neutral-900 text-white text-center text-2xl">
                {activeForm.text}
            </header>

            <div className="p-4">
                <form onSubmit={handleSubmitForm(1)}>
                    {Object.keys(activeForm.choices).map(key => {
                        const choice = activeForm.choices[key];
                        if (choice) {
                            return <div key={key} className="mt-1 block w-full py-4 px-2 text-emerald-300 border-2 border-emerald-600 rounded-lg text-2xl text-center">
                                <span className="ml-2">{choice}</span>
                            </div>
                        }
                    })}
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