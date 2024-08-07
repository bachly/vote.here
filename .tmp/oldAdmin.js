// import axios from "axios";
// import useAxios from "axios-hooks"
// import clsx from "clsx";
// import { useEffect, useState } from "react"

// export default function AdminPage() {
//     const [{ data: forms, loading: isFetchingForms, error: errorFetchingForms }, refetchForms] = useAxios(
//         '/api/get-forms'
//     )

//     const [currentForms, setCurrentForms] = useState();

//     useEffect(() => {
//         const formDict = {};

//         if (forms && forms.result) {
//             forms.result.map(form => {
//                 formDict[form.formId] = {
//                     ...form,
//                     __loading: false,
//                 };
//             })

//             setCurrentForms(formDict);
//         }
//     }, [forms])

//     function updateChoice({ form, key }) {
//         return (event) => {
//             event && event.preventDefault();
//             setCurrentForms({
//                 ...currentForms,
//                 [form.formId]: {
//                     ...currentForms[form.formId],
//                     choices: {
//                         ...currentForms[form.formId].choices,
//                         [key]: event.target.value
//                     }
//                 }
//             })
//         }
//     }

//     function updateText({ form, key }) {
//         return (event) => {
//             event && event.preventDefault();
//             setCurrentForms({
//                 ...currentForms,
//                 [form.formId]: {
//                     ...currentForms[form.formId],
//                     text: event.target.value
//                 }
//             })
//         }
//     }

//     function updateMaxChoices({ form, key }) {
//         return (event) => {
//             event && event.preventDefault();
//             setCurrentForms({
//                 ...currentForms,
//                 [form.formId]: {
//                     ...currentForms[form.formId],
//                     maxchoices: event.target.value
//                 }
//             })
//         }
//     }

//     function updateStatus({ form, status }) {
//         return (event) => {
//             event && event.preventDefault();

//             setCurrentForms({
//                 ...currentForms,
//                 [form.formId]: {
//                     ...currentForms[form.formId],
//                     status
//                 }
//             })

//             setCurrentForms({
//                 ...currentForms,
//                 [form.formId]: {
//                     ...currentForms[form.formId],
//                     __loading: true
//                 }
//             })

//             axios.post('/api/save-form', {
//                 formId: form.formId,
//                 choices: currentForms[form.formId].choices,
//                 maxchoices: currentForms[form.formId].maxchoices,
//                 status,
//             }).then(() => {
//                 setTimeout(() => {
//                     refetchForms();
//                 }, 500)
//             })
//         }
//     }

//     function handleSaveForm({ form, status }) {
//         return (event) => {
//             event && event.preventDefault();

//             setCurrentForms({
//                 ...currentForms,
//                 [form.formId]: {
//                     ...currentForms[form.formId],
//                     __loading: true
//                 }
//             })

//             axios.post('/api/save-form', {
//                 formId: form.formId,
//                 text: currentForms[form.formId].text,
//                 choices: currentForms[form.formId].choices,
//                 maxchoices: currentForms[form.formId].maxchoices,
//                 status: currentForms[form.formId].status,
//             }).then(() => {
//                 setTimeout(() => {
//                     refetchForms();
//                 }, 500)
//             })
//         }
//     }

//     function resetEntries() {
//         axios.post('/api/reset-entries').then(({ data }) => {
//             console.log('[resetEntries] Success', data);
//             alert('Successfully reset all submissions');
//         });
//     }

//     return <div className="bg-neutral-200">
//         <header className="py-2 bg-black text-white text-center text-2xl">
//             <div className="flex items-center justify-between px-4">
//                 <div>
//                     Admin
//                 </div>
//                 <div className="flex items-center">
//                     <div className="mr-6">
//                         <a href="/voting-slips" target="_blank" className="text-neutral-400 text-lg hover:underline hover:text-white">
//                             Voting slips with QR Code
//                         </a>
//                     </div>
//                     <div className="mr-6">
//                         <a href="/screen" target="_blank" className="text-neutral-400 text-lg hover:underline hover:text-white">
//                             Screen
//                         </a>
//                     </div>
//                     <div className="">
//                         <button className="bg-red-500 py-2 px-6 text-white hover:bg-red-600 text-base rounded-md" onClick={resetEntries}>Reset submissions</button>
//                     </div>
//                 </div>
//             </div>
//         </header>

//         {isFetchingForms && <>Loading forms...</>}
//         {errorFetchingForms && <>Error fetching forms...</>}
//         {currentForms &&
//             <div className="p-4 grid grid-cols-3 gap-8">
//                 {Object.keys(currentForms).map(key => {
//                     const form = currentForms[key];

//                     return <div className={clsx("bg-white p-8 border-4 rounded-2xl max-w-3xl", form.status === 'active' ? 'border-red-500 bg-red-50' : 'border-transparent bg-white')}>
//                         {form.__loading && <>Loading...</>}
//                         {!form.__loading && <>
//                             <h2 className="text-3xl">
//                                 Round {key}
//                                 {form.status === 'active' && <span className="text-red-500 font-bold ml-2 text-base">LIVE!</span>}
//                             </h2>

//                             <div className="mt-4"></div>
//                             <h3>Text</h3>
//                             <input
//                                 onChange={updateText({ form, key })}
//                                 className="w-full border border-neutral-400 rounded-lg p-2" type="text" defaultValue={form.text} />

//                             <h3 className="mt-4">Choices</h3>
//                             {Object.keys(form.choices).map((key) => {
//                                 return <div className="mt-1">
//                                     <input
//                                         onChange={updateChoice({ form, key })}
//                                         className="w-full border border-neutral-400 rounded-lg p-2"
//                                         type="text" defaultValue={form.choices[key]}></input>
//                                 </div>
//                             })}

//                             <h3 className="mt-4">Maximum number of answers</h3>
//                             <select
//                                 onChange={updateMaxChoices({ form, key })}
//                                 className="w-full border border-neutral-400 rounded-lg p-2">
//                                 <option value={1} selected={parseInt(form.maxchoices) === 1}>1</option>
//                                 <option value={2} selected={parseInt(form.maxchoices) === 2}>2</option>
//                             </select>

//                             <div className="mt-4"></div>
//                             <button onClick={handleSaveForm({ form, status: 'inactive' })} className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-lg">Save</button>
//                             <button onClick={updateStatus({ form, status: 'active' })} className="ml-2 py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-lg">To screen</button>
//                         </>
//                         }
//                     </div>
//                 })}
//             </div>}
//     </div>
// }