import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseApp";

export async function getOverhead({ eventId }) {
    try {
        if (!eventId) {
            throw new Error("Missing eventId")
        }

        const docRef = doc(db, "Overheads", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            throw new Error("Overhead document does not exist")
        }
    } catch (error) {
        console.error(error);
        return error;
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
        return error;
    }
}

export async function setPollAnswers({ pollId, voterId, voterAnswers }) {
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
        return error;
    }
}