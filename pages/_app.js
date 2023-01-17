import { Provider } from "next-auth/client";

import Layout from "../components/layout/layout";
import "../styles/globals.css";
import '@rmcooper/next-fullcalendar/common/main.css'
import '@rmcooper/next-fullcalendar/daygrid/main.css'
import '@rmcooper/next-fullcalendar/timegrid/main.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
