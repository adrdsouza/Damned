import { renderHook, act, waitFor } from '@/testing/utils';
import { useFetchProduct } from '.'

it('mounts without crashing', async () => {
    const { result } = renderHook(() => useFetchProduct());

    await act(async () => {
      expect(result.current.hello).toEqual('world');
    });
});