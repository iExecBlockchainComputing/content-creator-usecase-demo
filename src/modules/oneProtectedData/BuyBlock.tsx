import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from '@/components/Alert.tsx';
import { Button } from '@/components/ui/button.tsx';
import { getDataProtectorClient } from '@/externals/dataProtectorClient.ts';
import { useUserStore } from '@/stores/user.store';
import { nrlcToRlc } from '@/utils/nrlcToRlc.ts';
import { myCollectionsQuery } from '../profile/myCollections.query';

export function BuyBlock({
  protectedDataAddress,
  salePriceInNRLC,
}: {
  protectedDataAddress: string;
  salePriceInNRLC: number;
}) {
  const queryClient = useQueryClient();
  const { address } = useUserStore();
  const {
    isLoading,
    data: collections,
    isError,
    error,
  } = useQuery(myCollectionsQuery({ address: address! }));

  const buyProtectedDataMutation = useMutation({
    mutationKey: ['buyProtectedData'],
    mutationFn: async () => {
      const { dataProtectorSharing } = await getDataProtectorClient();
      return dataProtectorSharing.buyProtectedData({
        protectedData: protectedDataAddress,
        price: salePriceInNRLC,
        addToCollectionId: collections![0].id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['protectedData', protectedDataAddress],
      });
    },
  });
  if (isError) {
    return (
      <div className="mb-6 mt-9">
        <Alert variant="error">
          <p>Oops, something went wrong while loading your collections.</p>
          <p className="mt-1 text-sm">{error.toString()}</p>
        </Alert>
      </div>
    );
  }
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
          isLoading={isLoading || buyProtectedDataMutation.isPending}
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
