import * as db from '../../lib/db';

const handler = async (req, res) => {
    const { formId, text, choices, maxchoices, status } = req.body;

    const result = await db.updateForm({
        formId, text, choices, maxchoices, status
    });

    res.send({ ok: true, result });
}

export default handler;