import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../scss/app.scss';

import Feed from './Feed';
import Home from './Home';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <FontAwesomeIcon icon={faGithub} size="4x" />
        </header>
        <Switch>
          <Route path="/feed/:username" component={Feed} />
          <Route component={Home} />
        </Switch>        
      </div>
    </Router>
  );
};
