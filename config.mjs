export const Config = (() => {
  const firstName = "Lee"
  const lastName = "Byron"

  const fullName = firstName + " " + lastName
  const domainRoot = "https://leebyron.com"
  const canonicalRoot = domainRoot + "/til/"
  const twitterAt = "@leeb"

  const githubUsername = "leebyron"
  const githubRepo = "til"

  return {
    FIRST_NAME: firstName,
    LAST_NAME: lastName,
    FULL_NAME: fullName,
    DOMAIN_ROOT: domainRoot,
    CANONICAL_ROOT: canonicalRoot,
    TWITTER_AT: twitterAt,
    GITHUB_USERNAME: githubUsername,
    GITHUB_REPO: githubRepo,
  }
})()
