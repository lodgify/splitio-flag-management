import { SplitFactory } from "@splitsoftware/splitio";
// Instantiate the SDK
const factory: SplitIO.IBrowserSDK = SplitFactory({
  core: {
    authorizationKey: "kjrqaceenlm6jkarhi3ku687l1ttoh384hd4",
    key: "key",
  },
});

const client: SplitIO.IBrowserClient = factory.client();
const manager: SplitIO.IManager = factory.manager();

export const SplitService = {
    client,
    manager,
    ready: () => new Promise((resolve) => client.on(client.Event.SDK_READY, resolve)),
    getSplits: () => manager.names().map(name => {
      const split = manager.split(name);
      debugger;
      return {
        name,
        status: split.status || 'unknown',
        tags: split.tags || ['Untagged'],
        creationDate: new Date(split.changeNumber).toLocaleDateString()
      };
    }),
  };