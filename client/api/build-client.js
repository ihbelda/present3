import axios from 'axios';

export default ({ req }) => {
  //console.log(req.headers);
  if (typeof window === 'undefined') {
    // We are on the server!
    // requests should be made to the long format
    
    return axios.create({
      baseURL: 'http://present3.us/', //(after having the domain)
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', (before having the domain)
      //baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // We are on the browser!
    // requests can be made with a base url of ''
    return axios.create({
      baseURL: '/'
    });
  }
};