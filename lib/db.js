'use strict';
import prisma from "./prisma";

export async function updateEntry({ username, formId, answer }) {
    try {
        if (!username) {
            return;
        }

        console.error(`[DB updateEntry] Params:`, { username, formId, answer });

        // TODO: Check if exists entry already exists for username and formId

        const result = await prisma.entry.updateMany({
            where: {
                username
            },
            data: {
                [`form${formId}Answer`]: answer
            },
        })
        console.error(`[DB updateEntry] Return (result):`, result);
        return result;
    } catch (error) {
        console.error(`[DB updateEntry] Error (error):`, error);
    }
}

export async function resetEntries() {
    try {
        const result = await prisma.entry.updateMany({
            data: {
                form1Answer: "",
                form2Answer: "",
                form3Answer: "",
                form4Answer: "",
                form5Answer: ""
            }
        });
        console.error(`[DB resetEntries] Return (result):`, result);
        return result;
    } catch (error) {
        console.error(`[DB resetEntries] Error (error):`, error);
    }
}

export async function getForms({ status }) {
    try {
        const conditions = {};

        if (status) {
            conditions.status = status;
        }

        // console.error(`[DB getForms] Params (params):`, conditions);
        const result = await prisma.form.findMany({
            where: {
                ...conditions
            }
        });
        // console.error(`[DB getForms] Return (result):`, result);
        return result;
    } catch (error) {
        console.error(`[DB getForms] Error (error):`, error);
    }
}

export async function getEntries({ formId }) {
    try {
        const result = await prisma.entry.findMany({
            where: {
                [`form${formId}Answer`]: { not: "" },
            }
        });
        console.error(`[DB getEntries] Return (result):`, result);
        return result;
    } catch (error) {
        console.error(`[DB getEntries] Error (error):`, error);
    }
}

export async function getEntry({ username }) {
    try {
        const result = await prisma.entry.findFirst({
            where: {
                username
            }
        });
        console.error(`[DB getEntry] Return (result):`, result);
        return result;
    } catch (error) {
        console.error(`[DB getEntry] Error (error):`, error);
    }
}

export async function updateForm({ formId, choices, maxchoices, status }) {
    try {
        if (!formId) {
            return;
        }

        console.error(`[DB updateForm] Params:`, { formId, choices, maxchoices });

        let data = {}

        if (choices) {
            data = {
                ...data,
                choices
            }
        };

        if (maxchoices) {
            data = {
                ...data,
                maxchoices
            }
        };

        if (status) {
            data = {
                ...data,
                status
            }
        };

        const result1 = await prisma.form.updateMany({
            data: {
                status: 'inactive'
            }
        })

        const result = await prisma.form.updateMany({
            where: {
                formId
            },
            data
        })
        console.error(`[DB updateForm] Return (result):`, result);
        return result;
    } catch (error) {
        console.error(`[DB updateForm] Error (error):`, error);
    }
}