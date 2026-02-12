---
"@dojoengine/react": patch
---

Fix shallow merge in entity subscription updates that caused sibling models within a namespace to be lost when a single model was updated via subscription.
