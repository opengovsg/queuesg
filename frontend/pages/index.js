import Layout from '../Components/layout'


const queueCode = 'ABCD'

export default function Home() {
  // useEffect(() => {
  //   console.log('useEffect');
  //   var socket = socketClient('http://localhost:4000');
  //   socket.on('connection', () => {
  //     // if (this.state.channel) {
  //     //   this.handleChannelSelect(this.state.channel.id);
  //     // }
  //   });
  // }, [])
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


