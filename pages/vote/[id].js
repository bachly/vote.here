import WORDS from '../../lib/words.json';
import useAxios from 'axios-hooks';

export default function ({ data }) {
    const id = data.id;

    const [{ data: activeForm, loading: isFetchingActiveForm, error: errorFetchingActiveForm }, refetch] = useAxios(
        '/api/get-forms'
    )

    if (isFetchingActiveForm) return <>Loading...</>
    if (errorFetchingActiveForm) return <>Error</>

    function handleSubmitForm(formId) {

    }

    return <div className="">
        <header className="py-2 bg-blue-800 text-white text-center text-2xl">Voter ID: {id.toUpperCase()}</header>

        <div className="p-4">
            {activeForm &&
                <form onSubmit={handleSubmitForm(1)}>
                    {activeForm.result.answers.map(answer => {
                        return <label className="mt-1 block w-full py-3 px-2 border border-neutral-500">
                            <input type="checkbox" className="mr-2" name="answer" value={answer}></input>
                            {answer}
                        </label>
                    })}
                </form>}
        </div>

        <footer className="fixed bottom-0 left-0 w-full">
            <button className="block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center text-2xl">Submit</button>
        </footer>
    </div>
}

export async function getServerSideProps({ params }) {
    const id = params.id;

    if (id) {
        return {
            props: {
                data: {
                    id
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