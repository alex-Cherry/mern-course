import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/useHttp';
import { AuthContext } from '../context/auth.context';
import Loader from '../components/loader';
import LinkCard from '../components/linkCard';

const DetailPage = () => {

  const [link, setLink] = useState(null);
  const linkId = useParams().id;
  const { request, loading } = useHttp();
  const { token } = useContext(AuthContext);
  
  const getLink = useCallback(async () => {
    try {
      const data = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      });
      setLink(data);
    } catch (err) {}
  }, [linkId, request, token]);

  useEffect(() => {
    getLink();
  }, [getLink]);

  if (loading) {
    return <Loader />
  }

  return (
    <React.Fragment>
      {!loading && link && <LinkCard link={link} /> }
    </React.Fragment>
  );
}

export default DetailPage;
