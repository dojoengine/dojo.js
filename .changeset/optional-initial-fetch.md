---
"@dojoengine/sdk": minor
"@dojoengine/internal": minor
---

Add `fetchInitialData` option to `subscribeEntityQuery` and `subscribeEventQuery`. When set to `false`, the initial fetch is skipped and only the subscription is opened. Defaults to `true` for backward compatibility.
