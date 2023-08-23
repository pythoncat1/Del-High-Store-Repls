const queries = {
  testQuery: "query TestQuery { currentUser { id } }",
  getTheme:
    "query { currentUser { activeThemeVersion { customTheme { colorScheme } values { editor { syntaxHighlighting { tags { name modifiers } values } } global { backgroundRoot backgroundDefault backgroundHigher backgroundHighest backgroundOverlay foregroundDefault foregroundDimmer foregroundDimmest outlineDimmest outlineDimmer outlineDefault outlineStronger outlineStrongest accentPrimaryDimmest accentPrimaryDimmer accentPrimaryDefault accentPrimaryStronger accentPrimaryStrongest accentPositiveDimmest accentPositiveDimmer accentPositiveDefault accentPositiveStronger accentPositiveStrongest accentNegativeDimmest accentNegativeDimmer accentNegativeDefault accentNegativeStronger accentNegativeStrongest redDimmest redDimmer redDefault redStronger redStrongest orangeDimmest orangeDimmer orangeDefault orangeStronger orangeStrongest yellowDimmest yellowDimmer yellowDefault yellowStronger yellowStrongest limeDimmest limeDimmer limeDefault limeStronger limeStrongest greenDimmest greenDimmer greenDefault greenStronger greenStrongest tealDimmest tealDimmer tealDefault tealStronger tealStrongest blueDimmest blueDimmer blueDefault blueStronger blueStrongest blurpleDimmest blurpleDimmer blurpleDefault blurpleStronger blurpleStrongest purpleDimmest purpleDimmer purpleDefault purpleStronger purpleStrongest magentaDimmest magentaDimmer magentaDefault magentaStronger magentaStrongest pinkDimmest pinkDimmer pinkDefault pinkStronger pinkStrongest greyDimmest greyDimmer greyDefault greyStronger greyStrongest brownDimmest brownDimmer brownDefault brownStronger brownStrongest black white } } } } }",
  getRepls:
    "query ManageAccountStorageUtilizationCurrentUser { currentUser { id username userSubscriptionType userPowerUpsByType { ... on UserError { message } ... on UnauthorizedError { message } ... on UserPowerUpsTypes { storage { currentSku } } } storageInfo { storageQuota { ... on StorageQuota { quota } } storageGracePeriodQuota { ... on StorageGracePeriodQuota { quota } } storageQuotaStatus2 { ... on StorageQuotaStatus { status } ... on ServiceUnavailable { message } } accountStorageUtilization { ...AccountStorageUtilization ... on UnauthorizedError { message } } } } } fragment AccountStorageUtilization on AccountStorageUtilization { total perRepl { usage percentage repl { id slug url title nextPagePathname iconUrl description likeCount commentCount runCount publicForkCount totalCyclesTips } } }",
  deleteRepl:
    "mutation ReplsDashboardDeleteRepl($id: String!) { deleteRepl(id: $id) { id } }",
};

async function gql(
  query: keyof typeof queries,
  sid: string,
  variables: object = {}
) {
  try {
    let data = await fetch("/api/gql", {
      method: "POST",
      body: JSON.stringify({
        query: queries[query as keyof typeof queries],
        variables,
        sid: sid,
      }),
    }).then(async (res) => {
      return await res.json();
    });

    return data.response.data;
  } catch (e) {
    return { response: { success: false } };
  }
}

export default gql;

/*
[{"operationName":"WorkspaceHeaderReplInfoDeleteRepl","variables":{"id":"ba9c5e8a-e813-4c37-a114-25699583f399"},"query":"mutation WorkspaceHeaderReplInfoDeleteRepl($id: String!) {\n  deleteRepl(id: $id) {\n    id\n    __typename\n  }\n}\n"}]
*/