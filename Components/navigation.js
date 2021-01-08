import Link from 'next/link'

export default function Navigation({ selected }) {
  return <nav className={'w-full h-16 mx-6 flex flex-row justify-start items-center'}>
    <Link href="/" >
      <a className={'h-full flex justify-center items-center no-underline font-medium text-red-500 text-lg'} >Queue SG</a>
    </Link>
    {/* <Link href="/">
      <a className={`w-24 h-full flex justify-center items-center no-underline font-medium hover:text-primary 
      ${selected === '/' ? 'text-primary' : 'text-gray'}`}>Home</a>
    </Link>
    <Link href="/blog">
      <a className={`w-24 h-full flex justify-center items-center no-underline font-medium hover:text-primary
      ${selected === '/blog' ? 'text-primary' : 'text-gray'}`}>Blog</a>
    </Link> */}
  </nav>
}