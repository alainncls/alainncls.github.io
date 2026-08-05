# Security Review: alainncls.github.io

    Date: 2026-05-29

    ## Executive Summary

    One medium integrity finding survived: the public Netlify CMS admin page loads a mutable CDN script without SRI or CSP.

    ## Scope

    | Field | Value |
| --- | --- |
| Repository | `/Users/alain/Documents/Perso/alainncls.github.io` |
| Branch | `main` |
| Remote default branch | `main` |
| Initial HEAD | `8b6151ba40a7fdbc17775264589a1b9336f4e92b` |
| Remote default SHA after fetch | `8b6151ba40a7fdbc17775264589a1b9336f4e92b` |
| Audited SHA | `8b6151ba40a7fdbc17775264589a1b9336f4e92b` |
| Fetch completed | `2026-05-29T05:44:24.090133+00:00` |
| Pull decision | `git pull --ff-only origin main` succeeded at 2026-05-29T05:44:25.409778+00:00 |
| Audited path | `/Users/alain/Documents/Perso/alainncls.github.io` |
| Audited source | `local-after-ff-pull` |
| Local preservation | Fast-forward pull was used only on a safe clean default-branch state; no local changes were discarded. |

Initial `git status --short --branch`:

```text
## main...origin/main
```

    ## Local State And Preservation

    Before any fetch or pull decision, `git status --short --branch` was captured for Git repositories and is shown above. For dirty, ahead, or standalone projects, the audit avoided unsafe pulls and used either the current local directory or a temporary snapshot of `origin/<default>` as documented. The generated report file itself is the only intended write in this project for this audit.

    ## Codex Security Usage And Limits

    The `@codex-security` plugin workflow was used explicitly for this project through its phase model: threat model, finding discovery, validation, and attack-path calibration. Subagents performed independent read-only passes over project batches, and I reconciled their results with manual review and package-manager tooling.

    Tools used for this project: manual static-site/CMS/CDN review; safe production header check; Codex Security subagent review.

    Limits:

    - `osv-scanner`, `trivy`, `semgrep`, `slither`, and `gitleaks`/`detect-secrets` were not installed on PATH; static review and package-manager audits were used instead.
- No destructive Git command was used. No `git reset --hard`, `git clean`, forced checkout, or forced pull was run.
- No live exploit was attempted against third-party services such as Discord, Strava, Dune, GitHub, Cloudflare, or production sites beyond safe header/status checks where explicitly noted.
- Secret values observed locally are not reproduced in this report.

    ## Existing Report Revalidation

    No prior security_report.md or local security scan report was found.

    ## Architecture

    Static GitHub Pages/Cloudflare site with a public `/admin/` Netlify CMS page. The CMS authenticates to GitHub and edits site content from the browser.

    ## Trust Boundaries

    - Anonymous site visitors
- CMS administrator browser session
- unpkg CDN and Netlify CMS script supply chain
- GitHub OAuth/CMS backend configured for content writes

    ## Module Analysis

    | Module | Review notes |
| --- | --- |
| `admin/index.html` | Loads Netlify CMS and local admin scripts. |
| `admin/config.yml` | Configures GitHub backend and editable content collections. |
| `static assets` | Reviewed for active JavaScript and secrets. |

    ## Interactions Between Modules And Projects

    The CMS admin points at the `alainncls/portfolio-alain` content repository, so compromise of the admin browser can affect the separate portfolio publishing workflow.

    ## OWASP And Security Class Review

    A08 Software and Data Integrity Failures is the main applicable class. XSS in CMS preview widgets was reviewed and not promoted because no lower-privileged attacker-controlled authoring boundary was evidenced.

    ## Dependencies And Supply Chain

    No package manifest or lockfile was found in this static output repository. The risky dependency is a runtime CDN script range rather than a local package install.

    ## Configuration, CI, Docker, Deployment, And Secrets

    A safe production header check on 2026-05-29 showed `/admin/` returns 200 and no Content-Security-Policy header; `Access-Control-Allow-Origin: *` is present on the static response.

    ## Findings

    ### F-01: Runtime CMS admin loads mutable CDN JavaScript without SRI or CSP

| Field | Value |
| --- | --- |
| Severity | Medium |
| Confidence | High |
| Status | Open |
| Project | alainncls.github.io |
| Module | admin CMS / supply chain |
| OWASP / CWE | OWASP A08:2021 Software and Data Integrity Failures |
| Files | admin/index.html:10; admin/config.yml:1; CNAME:1 |

**Description:** The public CMS admin page loads `https://unpkg.com/netlify-cms@^2.10.61/dist/netlify-cms.js`. The semver range is resolved by the CDN at request time, there is no Subresource Integrity, and the production admin response did not include a CSP to constrain script execution.

**Impact:** A compromised CDN response or malicious compatible package release can execute in the CMS administrator browser and target GitHub-backed content editing. This can lead to content tampering, credential/session abuse inside the CMS flow, or malicious site publication.

**Exploitation scenario:** An administrator opens `/admin/`. The browser fetches the mutable Netlify CMS bundle from unpkg. If the CDN/package is compromised, the script runs with the site origin and CMS privileges and can alter content or observe CMS/GitHub workflow data.

**Evidence:** `admin/index.html:10` uses an unpinned range from unpkg. `admin/config.yml:1` configures the GitHub backend. A safe header check on `https://alainnicolas.fr/admin/` returned 200 without CSP.

**Recommendation:** Vendor the CMS bundle locally or pin an exact version with SRI, add a strict CSP for `/admin/`, and remove the public admin if it is unused.

**Corrective fix:** Replace the CDN range with a reviewed local asset or exact immutable URL plus SRI; set `script-src` to self and only required trusted endpoints; validate CMS login after the change.

**Tests:** Add a static test that fails on `unpkg.com` or semver ranges in admin HTML and verify `curl -I /admin/` includes CSP.

    ## Reviewed Surfaces

    | Surface | Risk area | Outcome | Notes |
| --- | --- | --- | --- |
| Netlify CMS admin | Runtime third-party script integrity | Reported | Mutable CDN CMS script remains reportable. |
| CMS preview shortcodes | Stored XSS | Rejected | No separate lower-privileged authoring boundary was evidenced. |
| Static site assets | Secrets / active content | No issue found | No committed secrets found in reviewed static files. |

    ## Recommendations

    - Prioritize open High and Medium findings before dependency-only cleanup.
    - Add regression tests named in each finding before or with the fix.
    - Keep secrets out of tracked files and out of generated audit/report artifacts.
    - Re-run the package-manager audit commands after dependency updates.
    - For projects with privacy findings, decide whether the data should be encrypted, minimized, or removed from Git/history.

    ## Checklist

    - [x] Initial Git status documented before fetch/pull or standalone classification.
- [x] Remote default branch fetched for Git repositories; pull used only where safe.
- [x] Local dirty/ahead state preserved with temporary snapshots where needed.
- [x] Existing security reports revalidated where present.
- [x] Codex Security workflow applied: threat model, finding discovery, validation, attack-path calibration.
- [x] Subagents used for independent project batches.
- [x] OWASP Web/API, secrets, dependencies, config, CI, Docker/deploy, and supply-chain surfaces considered where applicable.
- [x] Web3-specific checks applied where contracts/signatures were present.
- [x] Findings were calibrated by exploitability, impact, exposure, privileges, and confidence.

    ## Limitations

    This report is based on the code, configs, Git state, subagent results, and tool output available locally on 2026-05-29. It is security-focused and intentionally excludes non-security best-practice comments unless they affect exploitability, impact, or supply-chain integrity. Runtime reproduction was bounded and avoided actions that could mutate external services or expose local secrets.
