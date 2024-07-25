import { render, act } from '@/testing/utils';
import { CheckoutProvider } from '.'

describe('Checkout ', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<CheckoutProvider  />);
    });
  });

  it('should match snapshot', () => {
    const { baseElement } = render(<CheckoutProvider />);
    expect(baseElement).toMatchSnapshot();
  });
});