"use client";

import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  // We want to call the signout API just after rendering the page
  // Put [] to indicate just one call, we can add dependencies if needed
  useEffect(() => {
    doRequest();
  }, []);

  return (<div>Signing you out...</div>);
};