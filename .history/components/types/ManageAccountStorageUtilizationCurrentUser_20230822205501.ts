type UserError = {
  __typename: "UserError";
  message: string;
};

type UnauthorizedError = {
  __typename: "UnauthorizedError";
  message: string;
};

type UserPowerUpsTypes = {
  __typename: "UserPowerUpsTypes";
  storage: {
    currentSku: string;
  };
};

type StorageQuota = {
  __typename: "StorageQuota";
  quota: number;
};

type StorageGracePeriodQuota = {
  __typename: "StorageGracePeriodQuota";
  quota: number;
};

type StorageQuotaStatus = {
  __typename: "StorageQuotaStatus";
  status: string;
};

type ServiceUnavailable = {
  __typename: "ServiceUnavailable";
  message: string;
};

type AccountStorageUtilization = {
  total: number;
  perRepl: {
    usage: number;
    percentage: number;
    repl: {
      id: string;
      slug: string;
      url: string;
      title: string;
      nextPagePathname: string;
      iconUrl: string;
      description: string;
      likeCount: number;
      commentCount: number;
      runCount: number;
    };
  }[];
};

type ManageAccountStorageUtilizationCurrentUserQuery = {
  currentUser: {
    id: string;
    username: string;
    userSubscriptionType: string;
    userPowerUpsByType: UserError | UnauthorizedError | UserPowerUpsTypes;
    storageInfo: {
      storageQuota: StorageQuota | StorageGracePeriodQuota;
      storageGracePeriodQuota: StorageGracePeriodQuota;
      storageQuotaStatus2: StorageQuotaStatus | ServiceUnavailable;
      accountStorageUtilization: AccountStorageUtilization | UnauthorizedError;
    };
  };
};

export default ManageAccountStorageUtilizationCurrentUserQuery;