import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
import Head from 'next/head';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Head>
        <title>Present3 US</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} /> 
      </div>
    </div> 
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // Ensure the child page (eg Landing Page also exec the pageProps)
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
   pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }
  
  return {
    pageProps,
    ...data
  }
};

export default AppComponent;