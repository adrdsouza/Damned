import { renderHook, act, waitFor } from '@/testing/utils';
import { useCountries } from '.'

it('mounts without crashing', async () => {
    const { result } = renderHook(() => useCountries());

    await act(async () => {
      expect(result.current.hello).toEqual('world');
    });
});