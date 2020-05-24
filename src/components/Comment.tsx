import * as React from "react";
import {useAyanami} from "ayanami";
import CommentModel from "../models/Comment";
import prettyMilliseconds from "pretty-ms";
import Current from "../models/Current";

export default function Comment({ id }: { id: number }) {
    const [{ user, time, content, repliesCount, replyIds, isVoted }, actions] = useAyanami(CommentModel, { scope: id });
    const [, currentActions] = useAyanami(Current);
    const [ diplayTime, setTime ] = React.useState('');
    const [ isExpanded, setExpanded ] = React.useState(true);
    React.useEffect(() => {
        actions.getComment(id);
    }, [id, actions]);
    React.useEffect(() => {
        setTime(prettyMilliseconds(Date.now() - time));
    }, [time]);
    console.log('comment' + id);
    return <div className='comment-wrapper'>
        <div className="vote-wrapper">
            <span
                style={{ visibility: isExpanded && !isVoted ? 'visible' : 'hidden' }}
                onClick={() => actions.vote({})}
            >&Delta;</span>
        </div>
        <div>
            <div className="comment-title title">{user} {diplayTime} ago&nbsp;
                {isVoted && <a href="sth" onClick={event => {
                    event.preventDefault();
                    actions.unvote({});
                }}>unvote</a>}
                <a
                    href="sth"
                    onClick={event => {
                        event.preventDefault();
                        setExpanded(!isExpanded);
                    }}
                >[{isExpanded ? '-' : `${repliesCount + 1} more`}]</a>
            </div>
            <div style={{ display: isExpanded ? 'block' : 'none' }} className="comment-content">
                <div>{content}</div>
                <a
                    href="sth"
                    onClick={event => {
                        event.preventDefault();
                        currentActions.setCommentId(id);
                        currentActions.setExtraInfo(`reply to ${user}`);
                    }}
                >reply</a>
                <div className="replies-container">
                    {replyIds.map(id => <Comment id={id} key={id} />)}
                </div>
            </div>
        </div>
    </div>;
}
