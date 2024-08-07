// import useAxios from 'axios-hooks';
// import { useInterval } from '../lib/hooks';
// import { useState } from 'react';
// import axios from 'axios';
// import { useEffect } from 'react';

// export default function () {
//     const [activeForm, setActiveForm] = useState();
//     const [answerCounter, setAnswerCounter] = useState();
//     const [totalResponses, setTotalReponses] = useState(0);

//     useEffect(() => {
//         getActiveForm();
//     }, [])

//     function getActiveForm() {
//         axios.get('/api/get-forms?status=active').then(({ data }) => {
//             setActiveForm({
//                 ...data.result[0]
//             });
//         })
//     }

//     useInterval(() => {
//         getActiveForm();
//     }, 2000);

//     useEffect(() => {
//         fetchEntries();
//     }, [activeForm])

//     function fetchEntries() {
//         if (activeForm) {
//             axios.get(`/api/get-entries?formId=${activeForm.formId}`).then(({ data }) => {
//                 const answers = data.result;
//                 setAnswerCounter(answers);

//                 // set total
//                 let total = 0;
//                 if (answers) {
//                     Object.keys(answers).map(answerValue => {
//                         const count = answers[answerValue];
//                         total = total + count;
//                     })
//                 }
//                 setTotalReponses(total);
//             })
//         }
//     }

//     return <div className="min-h-screen bg-black">
//         {activeForm && parseInt(activeForm.formId) === 0 &&
//             <div className="min-h-screen min-w-screen flex items-center justify-center">
//                 <div className="text-white text-5xl">
//                     {activeForm.text}
//                 </div>
//             </div>}

//         {activeForm && parseInt(activeForm.formId) > 0 && <>
//             <header className="py-7 px-4 bg-neutral-900 text-white text-center text-5xl">
//                 <div className="flex items-center justify-between">
//                     <div className="text-left">{activeForm.text}</div>
//                     <div className="text-right text-neutral-400">Total responses: {totalResponses}</div>
//                 </div>
//             </header>

//             <div className="p-4 grid grid-cols-1 gap-2">
//                 {Object.keys(activeForm.choices).map(key => {
//                     const choice = activeForm.choices[key];
//                     const percentage = answerCounter && answerCounter[choice] && `${(answerCounter[choice] / totalResponses * 100).toFixed(1)}%` || 0;
//                     const counter = answerCounter && answerCounter[choice];
//                     if (choice) {
//                         return <div key={key} className="relative mt-1 block w-full py-4 px-2 text-emerald-300 border-2 border-emerald-600 rounded-lg text-3xl text-center">
//                             <div className="relative z-10 flex items-center justify-center">
//                                 <span className="">{choice}</span>
//                                 {counter &&
//                                     <div className="absolute top-0 right-2 z-10 ml-2 text-white text-3xl flex items-center justify-center">
//                                         {counter} responses • {percentage}
//                                     </div>}
//                             </div>
//                             {counter &&
//                                 <div className="absolute top-0 left-0 h-full bg-emerald-800 z-0"
//                                     style={{ width: percentage }}>
//                                 </div>}
//                         </div>
//                     }
//                 })}
//             </div>

//         </>}
//     </div>
// }

// export async function getServerSideProps({ params }) {
//     return {
//         props: {

//         }
//     }
// }