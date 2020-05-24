interface Comment {
    id: number;
    user: string;
    content: string;
    replyIds: number[];
    time: number;
    isVoted: boolean;
    voteCount: number;
    articleId: number;
    parentId: number;
    repliesCount: number;
}

export default Comment;
