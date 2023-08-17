import * as db from '../../lib/db';

const handler = async (req, res) => {
    try {
        const result = await db.resetEntries();
        res.send({ ok: true, result });
    } catch (err) {
        console.log('[/api/reset-entries] Error (err):', err);
        res.status(400).json({ error: true, message: err.message });
        res.end();
    }gi
}

export default handler;