import * as React from "react";
import {useAyanami} from "ayanami";
import ArticleModel from "../models/Article";
import Current from "../models/Current";
import CommentModel from "../models/Comment";

export default function Form() {
    const [ { commentsCount }, actions ] = useAyanami(ArticleModel);
    const [ { commentId, extraInfo }, currentActions ] = useAyanami(Current);
    const [, commentActions] = useAyanami(CommentModel, { scope: commentId });
    const [ inputString, setInput ] = React.useState('');
    React.useEffect(() => {
        setInput('');
        currentActions.setCommentId(-1);
        currentActions.setExtraInfo('');
    }, [commentsCount, currentActions]);
    console.log('form')
    return <>
        <textarea name="" cols={30} rows={10} value={inputString} onChange={e => setInput(e.target.value)}/>
        <div className="operations">
            <button onClick={() => {
                if (commentId !== -1) {
                    return commentActions.reply(inputString);
                }
                actions.comment(inputString);
            }}>add comment</button>
            <br/>
            {extraInfo}&nbsp;
            {extraInfo && <a href="sth" onClick={event => {
                event.preventDefault();
                currentActions.setCommentId(-1);
                currentActions.setExtraInfo('');
            }}>cancel replying</a>}
        </div>
    </>;
}
