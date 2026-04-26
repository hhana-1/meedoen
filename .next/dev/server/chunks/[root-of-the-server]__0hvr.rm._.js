module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/id-scan/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/client.mjs [app-route] (ecmascript) <export Anthropic as default>");
;
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
    apiKey: process.env.ANTHROPIC_API_KEY
});
async function POST(req) {
    if (!process.env.ANTHROPIC_API_KEY) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'ID scan not configured'
        }, {
            status: 503
        });
    }
    const formData = await req.formData();
    const frontFile = formData.get('front');
    const backFile = formData.get('back');
    if (!frontFile && !backFile) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'No images provided'
        }, {
            status: 400
        });
    }
    async function fileToBase64(file) {
        const buf = await file.arrayBuffer();
        const data = Buffer.from(buf).toString('base64');
        const mediaType = file.type || 'image/jpeg';
        return {
            data,
            mediaType
        };
    }
    const imageContent = [];
    const textParts = [];
    if (frontFile) {
        const { data, mediaType } = await fileToBase64(frontFile);
        imageContent.push({
            type: 'image',
            source: {
                type: 'base64',
                media_type: mediaType,
                data
            }
        });
        textParts.push('First image: FRONT of the identity card');
    }
    if (backFile) {
        const { data, mediaType } = await fileToBase64(backFile);
        imageContent.push({
            type: 'image',
            source: {
                type: 'base64',
                media_type: mediaType,
                data
            }
        });
        textParts.push('Second image: BACK of the identity card');
    }
    const prompt = `You are reading a Dutch "Vreemdelingen identiteitsbewijs" (Alien Identity Document).

${textParts.join('\n')}

Extract ONLY the following fields and return them as valid JSON. Use null for any field you cannot read clearly.

Fields to extract:
- lastName: Family name (on front, after NAAM)
- firstName: Given name(s) (on front, second line under the family name)
- fullName: Full name combined (firstName + lastName)
- nationality: Nationality (on front, after NAT.)
- dateOfBirth: Date of birth in DD-MM-YYYY format (on front, after GEB.)
- placeOfBirth: Place of birth (on front, after TE)
- docType: Document type code (on front, after DOC. TYPE)
- frontDocNumber: Document number on front (on front, after DOC. NR.)
- backDocNumber: DOC.NR. on the back of the card (on back, first number)
- vnr: V-NR. — the Vreemdelingennummer, exactly 10 digits (on back, the number right below DOC.NR., starts with V-NR.)
- validUntil: Valid until date in DD-MM-YYYY format (on back, after GELDIG TOT)

Return ONLY a JSON object with these exact field names. No explanation, no markdown, just JSON.`;
    try {
        const response = await client.messages.create({
            model: 'claude-opus-4-7',
            max_tokens: 512,
            messages: [
                {
                    role: 'user',
                    content: [
                        ...imageContent,
                        {
                            type: 'text',
                            text: prompt
                        }
                    ]
                }
            ]
        });
        const raw = response.content[0].type === 'text' ? response.content[0].text : '';
        // Strip any markdown code fences if present
        const clean = raw.replace(/```(?:json)?\n?/g, '').replace(/```$/g, '').trim();
        const data = JSON.parse(clean);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        console.error('ID scan error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to read card. Please try a clearer photo.'
        }, {
            status: 422
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0hvr.rm._.js.map