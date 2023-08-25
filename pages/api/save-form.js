import * as db from '../../lib/db';

const handler = async (req, res) => {
    const { formId, text, choices, maxchoices, status, frozen } = req.body;

    const result = await db.updateForm({
        formId, text, choices, maxchoices, status, frozen
    });

    res.send({ ok: true, result });
}

export default handler;