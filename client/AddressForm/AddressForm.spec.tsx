import { render, act } from '@/testing/utils';
import { AddressForm } from '.'

describe('AddressForm ', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<AddressForm  />);
    });
  });

  it('should match snapshot', () => {
    const { baseElement } = render(<AddressForm />);
    expect(baseElement).toMatchSnapshot();
  });
});