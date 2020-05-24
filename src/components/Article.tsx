import * as React from "react";
import {useAyanami} from "ayanami";
import prettyMilliseconds from "pretty-ms";
import ArticleModel from "../models/Article";

export default function Article() {
    const [ { title, domain, time, points, poster, commentsCount }, actions ] = useAyanami(ArticleModel);
    const [ diplayTime, setTime ] = React.useState('');
    React.useEffect(() => {
        actions.updateArticle(1);
    }, [actions]);
    React.useEffect(() => {
        setTime(prettyMilliseconds(Date.now() - time));
    }, [time]);
    console.log('root')
    return <>
        <h2 className='main-title title'>{title}<span>({domain})</span></h2>
        <h3 className='sub-title title'>{points} points by {poster} {diplayTime} ago | {commentsCount} comments</h3>
    </>;
}
