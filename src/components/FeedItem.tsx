import { GitHubPushEventPayload } from "../types/GitHubEvent";
import { FeedEvent } from "../types/FeedEvent";

import '../scss/feed-item.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";

type PushEventFeedItemBodyProps = {
  payload: GitHubPushEventPayload,
};

function PushEventFeedItemBody({ payload }: PushEventFeedItemBodyProps) {
  const commitWord = payload.size === 1 ? 'commit' : 'commits';

  return <div className="push-event">
    <div>{ payload.size } { commitWord } to <span>{ payload.ref }</span></div>
    { payload.commits.map(commit => <div key={commit.sha} className="commit">
      <span>{ commit.sha.substring(0, 6) }</span>
      <span>{ commit.message }</span>
    </div>)}
  </div>;
}

type FeedItemProps = {
  event: FeedEvent,
  // bookmarked: boolean,
  onBookmarkToggle: (bookmarked: boolean) => any,
};

export default function FeedItem({ event, onBookmarkToggle }: FeedItemProps) {
  const createdAt = new Date(event.created_at);
  
  const action = (() => {
    if (event.type === 'PushEvent')
      return 'pushed to';
  })();

  const bookmarkIcon = event.bookmarked ? fasBookmark : farBookmark;

  const body = (() => {
    if (event.type === 'PushEvent')
      return <PushEventFeedItemBody payload={event.payload as GitHubPushEventPayload} />
  });

  return <div className="feed-item">
    <div className="feed-item__avatar" style={{backgroundImage: `url(${event.actor.avatar_url})` }}></div>
    <div className="feed-item__content">
      <div className="feed-item__description">
        <b>{ event.actor.display_login }</b> { action } <b>{ event.repo.name }</b>
        <FontAwesomeIcon icon={bookmarkIcon} onClick={() => onBookmarkToggle(!event.bookmarked)} />
        <small>{ createdAt.toLocaleString() }</small>
      </div>
      { typeof body === 'function' ? <div className="feed-item__body">{ body() }</div> : null }
    </div>
  </div>
};
