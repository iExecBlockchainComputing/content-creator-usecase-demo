import { IExecDataProtectorSharing } from '@iexec/dataprotector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from '@/components/Alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { useUserStore } from '@/stores/user.store';
import { nrlcToRlc } from '@/utils/nrlcToRlc.ts';

export function BuyBlock({
  protectedDataAddress,
  salePriceInNRLC,
}: {
  protectedDataAddress: string;
  salePriceInNRLC: number;
}) {
  const queryClient = useQueryClient();
  const { address } = useUserStore();

  const buyProtectedDataMutation = useMutation({
    mutationKey: ['buyProtectedData'],
    mutationFn: async () => {
      const { dataProtectorSharing } = await getDataProtectorClient();
      const collectionId = await getOrCreateCollectionId(
        dataProtectorSharing,
        address as string,
        protectedDataAddress
      );
      return dataProtectorSharing.buyProtectedData({
        protectedData: protectedDataAddress,
        price: salePriceInNRLC,
        addToCollectionId: collectionId as number,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['protectedData', protectedDataAddress],
      });
    },
  });

  return (
    <div className="mb-6 mt-9">
      <div className="flex w-full items-start">
        <div className="flex-1">
          This content is for purchase, and the content creator grants you
          exclusive ownership of this content.
        </div>
        <div className="pl-6 text-xl font-bold text-primary">
          {nrlcToRlc(salePriceInNRLC)} RLC
        </div>
      </div>
      <div className="mt-7 text-center">
        <Button
          isLoading={buyProtectedDataMutation.isPending}
          onClick={() => buyProtectedDataMutation.mutate()}
        >
          Buy content
        </Button>
      </div>

      {buyProtectedDataMutation.isError && (
        <Alert variant="error" className="mt-7">
          <p>Oops, something went wrong while buying this content.</p>
          <p className="mt-1 text-sm">
            {buyProtectedDataMutation.error.toString()}
          </p>
        </Alert>
      )}
    </div>
  );
}
async function getOrCreateCollectionId(
  dataProtectorSharing: IExecDataProtectorSharing,
  address: string,
  protectedDataAddress: string
) {
  const { collections } = await dataProtectorSharing.getCollectionsByOwner({
    owner: address,
  });
  let collectionId;
  if (collections.length > 0) {
    collectionId = Number(collections[0].id);
  } else {
    const res = await dataProtectorSharing.createCollection();
    collectionId = res.collectionId;
    await dataProtectorSharing.addToCollection({
      protectedData: protectedDataAddress,
      collectionId,
      addOnlyAppWhitelist: import.meta.env
        .VITE_PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
    });
  }

  return collectionId;
}
