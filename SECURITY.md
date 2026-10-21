# Security Policy

## Reporting a vulnerability

Please report security issues privately to **pe@juxitech.com**, or through GitHub Security Advisories for this repository. Do not open a public issue for a vulnerability.

Please include the affected page or file, steps to reproduce, and the impact you observed. We will acknowledge reports and coordinate a fix and disclosure timeline.

## Scope

This policy covers the browser-based host console under [`web/`](web/) and its GitHub Pages deployment. The desktop Qt application, the IMU firmware and the Microduck reference code are out of scope for this repository.

## Security model and limitations

- The console is a purely static client-side page. It has no backend, no database, no login and no telemetry; serial data is parsed and displayed only in the browser.
- It uses the **Web Serial API**. Serial access is granted per origin by the user and the selected port can be read from and written to by the page.
- The console is served from `https://juxi-technology.github.io/ICM42670P-High-Precision-IMU-Module/`. GitHub Pages project sites on the same `juxi-technology.github.io` origin share browser permissions, including previously granted serial ports. Keep all Pages projects on that origin trusted; use a dedicated custom domain if stronger isolation is required.
- GitHub Pages does not allow custom response headers. The page therefore uses a Content-Security-Policy `<meta>` tag and a `no-referrer` policy. `frame-ancestors` / `X-Frame-Options` cannot be enforced through GitHub Pages, so clickjacking protection requires custom hosting.
- Destructive calibration actions (reset calibration data) require a confirmation dialog.
- The serial protocol is a local hardware link and has no transport authentication. Only connect trusted devices, and be aware that the page can send calibration and reset commands to the selected device.

## Deployment hardening

Maintainers should:

- enable two-factor authentication for all organization members with write access;
- protect `main` with required reviews and disallow force pushes;
- protect the `github-pages` environment with required reviewers where available;
- keep the workflow permissions minimal (`contents: read`, `pages: write`, `id-token: write`);
- keep the GitHub Actions in `.github/workflows/pages.yml` pinned to commit SHAs, and review any change to `web/` before merging;
- review the Pages deployment history after account or permission changes.

## Revoking serial access

Users can revoke a site's serial permission in Chrome / Edge site settings (look for "Serial ports" under the site's permissions), or by using the browser's site-data controls. Access is granted per origin, not per page path.
