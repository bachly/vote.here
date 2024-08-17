import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "./firebaseApp";

export async function getUserInfo({ email }) {
    try {
        if (!email) {
            throw new Error("Missing email")
        }

        const docRef = doc(db, "Users", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            throw new Error("Users document does not exist")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPollsByUser({ email }) {
    const polls = [];

    try {
        if (!email) {
            throw new Error("Missing email")
        }

        const q = query(collection(db, "Polls"), where('createdBy', '==', "admin"));
        const qSnapshot = await getDocs(q);

        if (qSnapshot) {
            qSnapshot.forEach(doc => {
                polls.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            return polls;
        } else {
            throw new Error("Poll documents do not exist")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getOverhead({ eventId }) {
    try {
        if (!eventId) {
            throw new Error("Missing eventId")
        }

        const docRef = doc(db, "Overheads", "1");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            throw new Error("Overhead document does not exist")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getPoll({ pollId }) {
    try {
        if (!pollId) {
            throw new Error("Missing pollId")
        }

        const docRef = doc(db, "Polls", pollId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            throw new Error("Poll document does not exist")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function setVoterAnswers({ pollId, voterId, voterAnswers }) {
    try {
        if (!pollId || !voterId || !voterAnswers) {
            throw new Error("Missing pollId, voterId or answers")
        }

        const docRef = doc(db, "Polls", pollId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const newData = docSnap.data();

            newData.voterAnswers = newData.voterAnswers || {}

            Object.entries(voterAnswers).map(([voterAnswer, status]) => {
                if (status) {
                    console.log(voterAnswer, status)
                    newData.voterAnswers[voterAnswer] = newData.voterAnswers[voterAnswer] || {};
                    newData.voterAnswers[voterAnswer][voterId] = 1;

                    console.log('New data:', newData);
                } else {
                    console.log(voterAnswer, status)
                    delete newData.voterAnswers[voterAnswer][voterId];
                }
            })
            await setDoc(docRef, newData);
        } else {
            throw new Error("Poll document does not exist")
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function setCurrentPoll({ currentPollId, currentOverheadPollId }) {
    try {
        const docRef = doc(db, "Overheads", "1");
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        if (currentPollId) {
            await setDoc(docRef, {
                ...data,
                currentPollId
            });
        } else if (currentOverheadPollId) {
            await setDoc(docRef, {
                ...data,
                currentOverheadPollId
            });
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function setPoll({ pollId, question, answers, maxchoices }) {
    try {
        if (!pollId) {
            throw new Error("Missing pollId")
        }

        const docRef = doc(db, "Polls", pollId);
        const docSnap = await getDoc(docRef);
        const currentData = docSnap && docSnap.data();

        await setDoc(
            docRef, {
            ...currentData,
            question,
            answers,
            maxchoices
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function resetVoterAnswers({ pollId }) {
    try {
        if (!pollId) {
            throw new Error("Missing pollId")
        }

        const docRef = doc(db, "Polls", pollId);
        const docSnap = await getDoc(docRef);
        const currentData = docSnap && docSnap.data();

        await setDoc(docRef, {
            ...currentData,
            voterAnswers: {}
        });

    } catch (error) {
        console.error(error);
        throw error;
    }
}