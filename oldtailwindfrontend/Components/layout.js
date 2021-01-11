import Head from 'next/head'
export default function Layout(props) {
  return (
    <>
      <Head>
        <title>next js site</title>
        <meta
          name="description"
          content={``}
        />
      </Head>
      <div className={"min-h-screen flex flex-col justify-start items-center font-sans"}>
        <div className={"max-w-screen-sm w-full min-h-screen bg-gray-100"}>
          {props.children}
        </div>
      </div>
    </>

  )
}