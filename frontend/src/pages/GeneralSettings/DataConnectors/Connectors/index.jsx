import { useHistory } from 'react-router-dom';

// ...

const history = useHistory();

if (!connector || !CONNECTORS.hasOwnProperty(connector)) {
  history.push(paths.home());
  return;
}
  const { connector } = useParams();
  if (!connector || !CONNECTORS.hasOwnProperty(connector)) {
    window.location = paths.home();
    return;
  }

  const Page = CONNECTORS[connector];
  return <Page />;
}
