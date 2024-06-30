import { render, act } from '@/testing/utils';
import { Protected } from '.'

describe('Protected ', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<Protected  />);
    });
  });

  it('should match snapshot', () => {
    const { baseElement } = render(<Protected />);
    expect(baseElement).toMatchSnapshot();
  });
});