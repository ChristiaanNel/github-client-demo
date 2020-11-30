import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../scss/home.scss';

export default function Home() {
  const [username, setUsername] = useState('');
  const history = useHistory();

  const search = () => {
    username && history.push(`/feed/${username}`);
  };

  return <div className="home">
    <h3>Enter a user's GitHub username to view their public feed</h3>
    <div>
      <input
        type="text"
        placeholder="Username"
        onInput={({ target }) => setUsername((target as HTMLInputElement).value)}
        onKeyPress={(ev) => ev.key === 'Enter' && search()}
      />

      <button
        type="button"
        disabled={!username}
        onClick={search}
      >Search</button>
    </div>
  </div>;
};
