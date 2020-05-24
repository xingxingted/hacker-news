interface Article {
    id: number;
    title: string;
    points: number;
    domain: string;
    poster: string;
    time: number;
    commentsCount: number;
    commentIds: number[];
}

export default Article;
