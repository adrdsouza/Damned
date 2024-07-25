// import { useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';

// import { useSession } from '@/client/SessionProvider';
// import { Progress } from '@/ui/progress';
// import { Button } from '@/ui/button';
// import { checkoutSteps } from './steps';

// export function CheckoutProgress() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { cart } = useSession();
//   const currentStep = checkoutSteps.findIndex((step) => pathname.startsWith(step.pathname));
//   const lastStep = currentStep - 1;
//   const isFinalStep = currentStep === checkoutSteps.length - 1;

//   useEffect(() => {
//     if (!cart || isFinalStep) {
//       return;
//     }

//     const itemCount = cart.contents?.itemCount;
//     if (itemCount === 0) {
//       router.push('/cart')
//     }
//   }, [cart]);

//   if (!currentStep || currentStep < 0) {
//     return null
//   };

//   const stepDetails = checkoutSteps[currentStep];
//   const goBack = () => router.push(checkoutSteps[lastStep].pathname || '/cart');
//   return (
//     <div className="flex flex-col items-start w-full py-4 gap-y-4">
//       <div className="flex flex-col items-start justify-start w-full lg:items-center gap-y-4 lg:flex-row">
//         {!isFinalStep && (
//           <Button
//             type="button"
//             variant="link"
//             onClick={goBack}
//             className="flex items-center justify-start -ml-4 text-base transition-colors hover:no-underline hover:text-blue-500 gap-x-2 group"
//           >
//             <div className="w-4 h-4 -mt-0.5">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
//                 <path
//                   className="group-hover:fill-current"
//                   d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
//                 />
//               </svg>
//             </div>
//             {lastStep < 1 ? 'Return to cart' : `Return to ${checkoutSteps[lastStep].label}`}
//           </Button>
//         )}
//         <h2 className="order-first py-2 text-xl lg:ml-auto lg:order-none">
//           <span className="font-semibold">Checkout:</span> {stepDetails.label}
//         </h2>
//       </div>
//       <Progress value={(currentStep / (checkoutSteps.length - 1)) * 100} />
//     </div>
//   )
// }
