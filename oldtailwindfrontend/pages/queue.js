import Layout from '../Components/layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import socketClient from "socket.io-client";
import { useRouter } from 'next/router'
import queryString from 'query-string';

export default function Queue(props) {
  let socket;
  const router = useRouter()

  useEffect(() => {
    const query = queryString.parse(location.search);
    // If code present, means new joiner 
    // join the queue and get a ticket
    if (query.code) {
      console.log('code');
      axios.post(`http://localhost:4000/api/queue/${query.code}/join`)
        .then((resp) => {
          console.log(resp.data);
        }).catch((err) => { console.log(err) })

      // router.push(`/ticket?id=12314`)
    }
  }

    , [])

  return (
    <Layout>
      <main className={" flex flex-col-reverse mx-6 md:my-24 md:flex-row justify-center items-center bg-gray-200"}>
        <div className={'flex flex-col justify-center items-center'}>
          <p className='w-96 font-medium text-3xl text-center'>
            This is the interim screen to join a queue
          </p>
        </div>
      </main>
    </Layout >
  )
}

