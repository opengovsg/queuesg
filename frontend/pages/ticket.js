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
    console.log('useEffect');
    const query = queryString.parse(location.search);
    // If only present, means new
    // join the queue and get a ticket
    if (query.id) {
      console.log('ticket');
      // try {
      //   const resp = await axios.get(`http://localhost:4000/api/queue/${router.query.code}`)
      // } catch (error) {

      // }
      // router.replace(`/queue?ticket=12314`)
    }
  }

    , [])

  return (
    <Layout>
      <main className={" flex flex-col-reverse mx-6 md:my-24 md:flex-row justify-center items-center bg-gray-200"}>
        <div className={'flex flex-col justify-center items-center'}>
          <p className='w-96 font-medium text-3xl text-center'>
            This screen is supposed to display your ticket number and line
          </p>
        </div>
      </main>
    </Layout >
  )
}

