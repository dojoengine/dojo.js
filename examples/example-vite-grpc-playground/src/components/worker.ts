self.onmessage = async (e) => {
    const {
        ToriiQueryBuilder,
        ClauseBuilder,
        AndComposeClause,
        OrComposeClause,
        KeysClause,
        MemberClause,
    } = await import("@dojoengine/sdk");
    try {
        const inputCode = new Function(
            "ToriiQueryBuilder",
            "ClauseBuilder",
            "AndComposeClause",
            "OrComposeClause",
            "KeysClause",
            "MemberClause",
            `return function() { ${e.data.code} }`
        );
        const result = inputCode(
            ToriiQueryBuilder,
            ClauseBuilder,
            AndComposeClause,
            OrComposeClause,
            KeysClause,
            MemberClause
        )();
        self.postMessage({ type: "success", result });
    } catch (error) {
        self.postMessage({
            type: "error",
            error: {
                message: (error as Error).message,
                stack: (error as Error).stack,
            },
        });
    }
};
