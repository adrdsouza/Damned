import Image from 'next/image';
interface MarkTicketProps {
  className?: string;
  mark?: string;
  text?: string;
}

const MarkTicket: React.FC<MarkTicketProps> = (props) => {
  return (
    <button className='gap-2 justify-center p-5 border border-slate-100 bg-white hover:bg-slate-100 flex flex-col items-center'>
      <Image
        src={`${props.mark}`}
        width={500}
        height={500}
        alt='this is mark'
        className='w-1/2 h-18'
      />
      <p className='text-md font-semibold'>{props.text}</p>
    </button>
  );
};

export default MarkTicket;
