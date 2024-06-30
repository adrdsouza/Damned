import { useSession } from '@/client/SessionProvider';

export default function Dashboard() {
  const { customer } = useSession();
  console.log(customer);
  return (
    <div className='flex flex-col gap-2'>
      <p>{`Hello ${customer?.firstName} (not admin? Log out)`}</p>
      <p>
        From your account dashboard you can view your recent orders, manage your
        shipping and billing address, and edit your password and account details
      </p>
    </div>
  );
}
