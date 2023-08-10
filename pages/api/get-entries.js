import * as db from '../../lib/db';

const handler = async (req, res) => {
    const formId = req.query.formId;

    try {
        const result1 = await db.getEntries({ formId });
        const answerCounter = {};

        result1.map(entry => {
            const answerValues = entry[`form${formId}Answer`];

            answerValues.map(answerValue => {
                if (answerCounter[answerValue]) {
                    answerCounter[answerValue] = answerCounter[answerValue] + 1;
                } else {
                    answerCounter[answerValue] = 1
                }
            })
        })

        res.send({ ok: true, result: answerCounter });
    } catch (err) {
        console.log('[/api/get-entries] Error (err):', err);
        res.status(400).json({ error: true, message: err.message });
        res.end();
    }
}

export default handler;