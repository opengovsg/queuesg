import Navigation from '../Components/navigation'
import Layout from '../Components/layout'

export default function Home() {
  return (
    <Layout>
      <main className={" flex flex-col-reverse mx-6 md:my-24 md:flex-row justify-center items-center bg-gray-200"}>
        <div className={'flex flex-col justify-center items-center'}>

          <p className='w-96 font-medium text-3xl text-center'>
            Hello there admin.
          </p>
        </div>
      </main>
    </Layout >
  )
}



