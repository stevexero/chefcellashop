import { CiUser, CiHeart, CiShoppingCart } from 'react-icons/ci';

const TopNavLinks = () => {
  return (
    <div className='text-white flex flex-row items-center'>
      <CiUser size='1.5rem' className=' cursor-pointer' />
      <CiHeart size='1.5rem' className='ml-4 cursor-pointer' />
      <CiShoppingCart size='1.5rem' className='ml-4 cursor-pointer' />
    </div>
  );
};

export default TopNavLinks;
