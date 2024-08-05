import * as db from '../../lib/db';

const handler = async (req, res) => {
    const { username, formId, answer } = req.body;

    const result = await db.updateEntry({
        username,
        formId,
        answer
    });

    res.send({ ok: true, result });
}

export default handler;