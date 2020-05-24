import Comment from "../entities/Comment";
import Article from "../entities/Article";
import {Injectable} from "@asuka/di";

interface TArticle extends Article {
    commentIds: number[];
}

interface TComment extends Comment {
    replyIds: number[];
    votedUsers: string[];
}

let userName: string | null;

let globalCommentId: number | null = null;
const globalCommentIdKey = 'globalCommentId';

@Injectable()
export default class DbHelper {
    getArticle(id: number): TArticle {
        const articleKey = `article-${id}`;
        const articleString = localStorage.getItem(articleKey);
        if (!articleString) {
            const article: TArticle = {
                id,
                title: `Article ${id}`,
                points: 0,
                domain: window.location.hostname,
                poster: this.getUserName(),
                time: Date.now(),
                commentsCount: 0,
                commentIds: [],
            };
            localStorage.setItem(articleKey, JSON.stringify(article));
            return article;
        }
        const article: TArticle = JSON.parse(articleString) as TArticle;
        let isToBeUpdated = false;
        article.commentIds = article.commentIds
            .filter(commentid => {
                const isInvalid = !this.getComment(commentid);
                if (isInvalid && !isToBeUpdated) {
                    isToBeUpdated = true;
                }
                return !isInvalid;
            });
        if (isToBeUpdated) {
            localStorage.setItem(articleKey, JSON.stringify(article));
        }
        return article;
    }

    getComment(id: number): TComment | null {
        const commentKey = `comment-${id}`;
        const commentString = localStorage.getItem(commentKey);
        if (!commentString) {
            return null;
        }
        const comment: TComment = JSON.parse(commentString) as TComment;
        let isToBeUpdated = false;
        comment.replyIds = comment.replyIds
            .filter(replayId => {
                const isInvalid = !this.getComment(replayId) || replayId === id;
                if (isInvalid && !isToBeUpdated) {
                    isToBeUpdated = true;
                }
                return !isInvalid;
            });
        if (isToBeUpdated) {
            localStorage.setItem(commentKey, JSON.stringify(comment));
        }
        return comment;
    }

    addComment(content: string, articleId: number, parentId: number) {
        const commentId = this.getGlobalId();
        const comment: TComment = {
            id: commentId,
            replyIds: [],
            user: this.getUserName(),
            content,
            time: Date.now(),
            isVoted: false,
            voteCount: 0,
            articleId,
            parentId,
            repliesCount: 0,
            votedUsers: [],
        };
        localStorage.setItem(`comment-${commentId}`, JSON.stringify(comment));
        this.updateGlobalId();
        return comment;
    }

    comment(articleId: number, content: string) {
        const articleKey = `article-${articleId}`;
        const articleString = localStorage.getItem(articleKey);
        if (!articleString) {
            throw new Error(`${articleKey} not found`);
        }
        const articleObj: TArticle = JSON.parse(articleString) as TArticle;
        const comment = this.addComment(content, articleId, -1);
        articleObj.commentIds.push(comment.id);
        articleObj.commentsCount++;
        localStorage.setItem(articleKey, JSON.stringify(articleObj));
        return comment;
    }

    reply(commentId: number, content: string) {
        const commentKey = `comment-${commentId}`;
        const commentString = localStorage.getItem(commentKey);
        if (!commentString) {
            throw new Error(`${commentKey} not found`);
        }
        const commentObj: TComment = JSON.parse(commentString) as TComment;
        const { articleId } = commentObj;
        const comment = this.addComment(content, articleId, commentId);
        commentObj.replyIds.push(comment.id);
        commentObj.repliesCount++;
        localStorage.setItem(commentKey, JSON.stringify(commentObj));
        let parent = this.getComment(commentObj.parentId);
        while (parent) {
            parent.repliesCount++;
            localStorage.setItem(`comment-${parent.id}`, JSON.stringify(parent));
            parent = this.getComment(parent.parentId);
        }
        const articleKey = `article-${articleId}`;
        const articleString = localStorage.getItem(articleKey);
        if (!articleString) {
            throw new Error(`${articleKey} not found`);
        }
        const articleObj: TArticle = JSON.parse(articleString) as TArticle;
        articleObj.commentsCount++;
        localStorage.setItem(articleKey, JSON.stringify(articleObj));
        return comment;
    }

    vote(commentId: number) {
        const comment = this.getComment(commentId) as TComment;
        comment.votedUsers.push(this.getUserName());
        localStorage.setItem(`comment-${commentId}`, JSON.stringify(comment))
    }

    unvote(commentId: number) {
        const comment = this.getComment(commentId) as TComment;
        const index = comment.votedUsers.indexOf(this.getUserName());
        if (index !== -1) {
            comment.votedUsers.splice(index, 1);
            localStorage.setItem(`comment-${commentId}`, JSON.stringify(comment))
        }
    }


    getUserName(): string {
        if (userName) {
            return userName;
        }

        const userNameKey = 'user-name';
        userName = localStorage.getItem(userNameKey);
        if (userName) {
            return userName;
        }

        const maxIndex = Math.floor(Math.random() * 10);
        const letters: string[] = [];
        for (let index = 0; index <= maxIndex; index++) {
            const baseLetter: string = index ? 'a' : 'A';
            letters.push(String.fromCharCode(baseLetter.charCodeAt(0) + Math.floor(Math.random() * 26)));
        }
        userName = letters.join('');
        localStorage.setItem(userNameKey, userName);
        return userName;
    }

    getGlobalId(): number {
        if (globalCommentId != null) {
            return globalCommentId;
        }
        const storedId = localStorage.getItem(globalCommentIdKey);
        if (storedId != null) {
            globalCommentId = parseInt(storedId);
            return globalCommentId;
        }
        globalCommentId = 0;
        localStorage.setItem(globalCommentIdKey, `${globalCommentId}`);
        return globalCommentId;
    }

    updateGlobalId() {
        if (globalCommentId != null) {
            localStorage.setItem(globalCommentIdKey, `${++globalCommentId}`);
        }
    }
}
