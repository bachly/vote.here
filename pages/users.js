import WORDS from '../lib/words.json';

export default function Users() {
    return <>
        <div className="grid grid-cols-4">
            {WORDS.map(id => {
                return <div className="p-6 text-center border border-black text-3xl">
                    <span className="font-bold">lnkt.to/vote/{id}</span>
                </div>
            })}
        </div>
    </>
}