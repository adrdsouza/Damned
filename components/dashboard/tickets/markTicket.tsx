import Image from 'next/image';
interface MarkTicketProps {
  className?: string;
  mark?: string;
  text?: string;
  onShow: any;
}

const MarkTicket: React.FC<MarkTicketProps> = (props) => {
  return (
    <button
      onClick={() => props.onShow(true)}
      className='p-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg flex flex-col justify-center items-center'
    >
      <Image
        src={`${props.mark}`}
        width={100}
        height={100}
        alt='this is mark'
        className='w-40 h-18'
      />
      <p className='text-lg font-semibold'>{props.text}</p>
    </button>
  );
};

export default MarkTicket;
