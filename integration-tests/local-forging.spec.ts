import { CONFIGS } from "./config";
import { commonCases, mumbaiCases } from './data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);

  describe(`Test local forger: ${rpc}`, () => {
    const mumbaiAndAlpha = protocol === Protocols.ProtoALpha || protocol == Protocols.PtMumbai2 ? it : it.skip;
    // all protocols
    commonCases.forEach(({ name, operation, expected }) => {
      it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(expected || operation);

        done();
      });
    });

    mumbaiCases.forEach(({ name, operation, expected}) => {
      mumbaiAndAlpha(`Verify that .forge for local forge smart rollup will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(expected || operation);

        done();
      });
    })
  });
});
