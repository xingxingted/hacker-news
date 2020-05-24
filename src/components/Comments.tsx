import * as React from "react";
import {useAyanami} from "ayanami";
import ArticleModel from "../models/Article";
import Comment from "./Comment";

export default function Comments() {
    const [ { commentIds } ] = useAyanami(ArticleModel);
    console.log('comments')
    return <>
        {commentIds.map(id => <Comment id={id} key={id} />)}
    </>;
}
