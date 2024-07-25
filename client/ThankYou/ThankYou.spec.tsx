import { render, act } from '@/testing/utils';
import { ThankYou } from '.'

describe('ThankYou ', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<ThankYou  />);
    });
  });

  it('should match snapshot', () => {
    const { baseElement } = render(<ThankYou />);
    expect(baseElement).toMatchSnapshot();
  });
});