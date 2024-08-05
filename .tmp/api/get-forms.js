import * as db from '../../lib/db';

const handler = async (req, res) => {
    try {
        const status = req.query.status || null;
        // console.log('[/api/get-forms] Params (params):', { status });
        const result = await db.getForms({ status });
        res.send({ ok: true, result });
    } catch (err) {
        console.log('[/api/get-forms] Error (err):', err);
        res.status(400).json({ error: true, message: err.message });
        res.end();
    }
}

export default handler;