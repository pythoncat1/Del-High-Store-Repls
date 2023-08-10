const queries = {
  "getRepls": "query ManageAccountStorageUtilizationCurrentUser { currentUser { id username userSubscriptionType userPowerUpsByType { ... on UserError { message } ... on UnauthorizedError { message } ... on UserPowerUpsTypes { storage { currentSku } } } storageInfo { storageQuota { ... on StorageQuota { quota } } storageGracePeriodQuota { ... on StorageGracePeriodQuota { quota } } storageQuotaStatus2 { ... on StorageQuotaStatus { status } ... on ServiceUnavailable { message } } accountStorageUtilization { ...AccountStorageUtilization ... on UnauthorizedError { message } } } } } fragment AccountStorageUtilization on AccountStorageUtilization { total perRepl { usage percentage repl { id slug url title nextPagePathname iconUrl } } }"
}


async function gql(query: any, sid: string, variables: any = {}) {
  try {
    let data = await fetch("/api/gql", {
      method: "POST",
      body: JSON.stringify({
        query: queries[query as keyof typeof queries],
        variables,
        sid: sid
      })
    }).then(async res => {
      return await res.json();  // Response object
    });

    return data.response.data;
  } catch (e) {
    return { response: { success: false } };
  }
}

export default gql;