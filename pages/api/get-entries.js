import * as db from '../../lib/db';

const handler = async (req, res) => {
    const formId = req.query.formId;

    try {
        const result = await db.getEntries({ formId });
        res.send({ ok: true, result });
    } catch (err) {
        console.log('[/api/get-entries] Error (err):', err);
        res.status(400).json({ error: true, message: err.message });
        res.end();
    }
}

export default handler;