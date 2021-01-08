import Layout from '../Components/layout'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Queue(props) {
  // const [datasets, setDatasets] = useState([])

  console.log(props);

  return (
    <Layout>
      <main className={" flex flex-col-reverse mx-6 md:my-24 md:flex-row justify-center items-center bg-gray-200"}>
        <div className={'flex flex-col justify-center items-center'}>
          <p className='w-80 font-medium text-3xl text-center'>
            Enter the code to <span className='text-red-600 underline'>Line Up</span>
          </p>
          <p className='w-96 font-medium text-3xl text-center'>
            No app to download, no login required.
          </p>
        </div>
      </main>
    </Layout >
  )
}

export async function getStaticProps() {
  // const resp = await axios.get('https://api.mocki.io/v1/ce5f60e2')
  const resp = await axios.get('http://localhost:4000/api/')
  return {
    props: {
      data: resp.data
    },
  }
}
