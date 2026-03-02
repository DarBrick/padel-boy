/**
 * Detects app basename for current runtime environment.
 * Uses /padel-boy only for github.io subdirectory deployment.
 */
export function getAppBasename(): string {
  const isGitHubPagesSubdirectory =
    window.location.hostname.includes('github.io') &&
    window.location.pathname.startsWith('/padel-boy')

  return isGitHubPagesSubdirectory ? '/padel-boy' : '/'
}
