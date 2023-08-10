import * as db from '../../lib/db';

const handler = async (req, res) => {
    const username = req.query.username;

    try {
        console.log('[/api/get-entries] Params (params):', { username });
        const result = await db.getEntry({ username });
        res.send({ ok: true, result });
    } catch (err) {
        console.log('[/api/get-entries] Error (err):', err);
        res.status(400).json({ error: true, message: err.message });
        res.end();
    }
}

export default handler;