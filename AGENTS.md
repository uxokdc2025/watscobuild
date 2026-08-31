# WatscoBuild execution rules

## Completion and deployment

- Treat deployment as part of the task whenever the requested outcome is expected on a Vercel URL.
- Resolve deployment, project-linkage, branch, alias, and cache issues directly when safe and reversible; do not stop at reporting them.
- Before claiming completion, verify the current Git commit and branch, the linked Vercel project, the deployment commit, and the preview alias.
- Confirm the live URL is running the expected commit and visibly contains the requested change. A successful build or a pushed commit is not completion when deployment is part of the task.
- Continue troubleshooting until the requested outcome is visible at the expected live URL. Report a blocker only when progress genuinely requires user input, credentials, approval, or an irreversible decision.

## Verification evidence

- Every implementation task must leave a commit or reviewed diff, affected-file list, build/test result, and runtime verification when applicable.
- Use preview URLs for verification. Check the deployed response and the rendered UI, not only local source files.
- If the live URL is stale, identify which deployment owns the alias and either update the alias or deploy the expected commit before reporting status.
