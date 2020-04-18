import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/useHttp';
import { AuthContext } from '../context/auth.context';
import Loader from '../components/loader';
import LinksList from '../components/linksList';

const LinksPage = () => {

  const [ links, setLinks ] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const fetchLinks = useCallback(async () => {
    try {
      const data = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      setLinks(data);
    } catch (err) {}
  }, [token, request]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      { !loading && <LinksList links={links} /> }
    </React.Fragment>
  );
}

export default LinksPage;
