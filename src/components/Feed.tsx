import React, { useEffect, useState } from "react";
import { GitHubEvent, GitHubPushEventPayload } from "../types/GitHubEvent";
import FeedItem from "./FeedItem";

import '../scss/feed.scss';
import { FeedEvent } from "../types/FeedEvent";
import { Octokit } from "@octokit/core";
import { useHistory, useParams } from "react-router-dom";

type FeedBookmarksToggleProps = {
  showBookmarks: boolean,
  toggle: (show: boolean) => any,
};

function FeedBookmarksToggle({ showBookmarks, toggle }: FeedBookmarksToggleProps) {
  return <button type="button" onClick={() => toggle(!showBookmarks)}>
    { showBookmarks ? 'All Events' : 'Bookmarked Events' }
  </button>
}

type FeedFilterProps = {
  onChange: ((value: string) => any)
};

function FeedFilter({ onChange }: FeedFilterProps) {
  return <input
    type="text"
    placeholder="Filter"
    onInput={({ target }) => onChange((target as HTMLInputElement).value)}
  />;
}

const filterEvent = (event: GitHubEvent, search: string) : boolean => {
  if (event.actor.display_login.toLowerCase().includes(search)) return true;
  if (event.repo.name.toLowerCase().includes(search)) return true;
  if (event.type === 'PushEvent') {
    const pushEventPayload = event.payload as GitHubPushEventPayload;
    if (pushEventPayload.commits.some(commit => commit.message.toLowerCase().includes(search)))
      return true;
  }
  return false;
};

export default function Feed() {
  const [ events, setEvents ] = useState<FeedEvent[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ filteredEvents, setFilteredEvents ] = useState<FeedEvent[]>([]);
  const [ filter, setFilter ] = useState<string>('');
  const [ showBookmarks, setShowBookmarks ] = useState<boolean>(false);
  const history = useHistory();
  const { username } = useParams() as { username: string };

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Cater for more event types
      const validEventType = ['PushEvent'];
      const octokit = new Octokit();
      const response = await octokit.request('GET /users/:username/received_events/public', {
        username,
        per_page: 100,
      }).catch(() => {
        alert('An error occurred.');
        history.push('/');
      });

      if (response && response.data)
      {
        const evts = response.data
          .filter(({ type }: GitHubEvent) => validEventType.includes(type))
          .map((ev: GitHubEvent) => ({ ...ev, bookmarked: false }));

        setEvents(evts);
      }

      setLoading(false);
    };

    fetchData();
  }, [username, history]);

  useEffect(() => {
    const newEvents = events
      .filter(event =>
        (!showBookmarks || event.bookmarked) && (!filter || filterEvent(event, filter)));
    setFilteredEvents([...newEvents]);
  }, [events, filter, showBookmarks]);

  return <div className="feed">
    <header>
      <FeedFilter onChange={(value) => setFilter(value.toLowerCase())} />
      <FeedBookmarksToggle showBookmarks={showBookmarks} toggle={(show) => setShowBookmarks(show)} />
    </header>
    <main>
      { loading
        ? <div className="feed__loading">Loading...</div>
        : filteredEvents.map(event => (
          <FeedItem
            key={event.id}
            event={event}
            onBookmarkToggle={(bookmarked) => console.log(event.id, bookmarked)}
          />))
      }
    </main>
  </div>;
};
