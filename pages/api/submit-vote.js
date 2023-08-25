import * as db from '../../lib/db';

const handler = async (req, res) => {
    const { username, formId, answer } = req.body;

    const currentForm = await db.getForm({ formId });

    console.log('currentForm:', currentForm);

    if (currentForm && currentForm.frozen) {
        res.send({ ok: false, message: "Voting is OFF. Your submission is not counted." });
    } else {
        const result = await db.updateEntry({
            username,
            formId,
            answer
        });

        res.send({ ok: true, result });
    }
}

export default handler;