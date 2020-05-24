import {Ayanami, Effect, EffectAction, ImmerReducer, Reducer} from "ayanami";
import Comment from "../entities/Comment";
import {Observable, of} from "rxjs";
import DbHelper from "../utils/db";
import {map, mergeMap, withLatestFrom} from "rxjs/operators";
import {Injectable} from "@asuka/di";
import ArticleModel from "./Article";

@Injectable()
export default class CommentModel extends Ayanami<Comment>{
    defaultState = {
        id: -1,
        user: '',
        content: '',
        time: 0,
        isVoted: false,
        voteCount: 0,
        replyIds: [],
        articleId: -1,
        parentId: -1,
        repliesCount: 0,
    }

    constructor(
        private readonly dbHelper: DbHelper,
        private readonly article: ArticleModel,
    ) {
        super();
    }

    @ImmerReducer()
    setIsVoted(state: Comment, isVoted: boolean) {
        state.isVoted = isVoted;
    }

    @ImmerReducer()
    setVoteCount(state: Comment, count: number) {
        state.voteCount = count;
    }

    @ImmerReducer()
    setReplyIds(state: Comment, replyIds: number[]) {
        state.replyIds = replyIds;
    }

    @ImmerReducer()
    setRepliesCount(state: Comment, count: number) {
        state.repliesCount = count;
    }

    @Reducer()
    updateComment(state: Comment, comment: Comment) {
        return comment;
    }

    @Effect()
    getComment(id$: Observable<number>): Observable<EffectAction> {
        return id$.pipe(
            map(id => this.getActions().updateComment(this.dbHelper.getComment(id) as Comment))
        );
    }

    @Effect()
    reply(payload$: Observable<string>, state$: Observable<Comment>): Observable<EffectAction> {
        return payload$.pipe(
            withLatestFrom(state$),
            withLatestFrom(this.article.getState$()),
            mergeMap(([[content, { id, replyIds, repliesCount }], { commentsCount }]) => {
                const comment = this.dbHelper.reply(id, content);
                const actions = this.getActions();
                return of(
                    actions.setReplyIds((replyIds || []).concat(comment.id)),
                    actions.setRepliesCount(repliesCount + 1),
                    this.article.getActions().setCount(commentsCount + 1),
                );
            })
        );
    }

    @Effect()
    vote(payload$: Observable<object>, state$: Observable<Comment>): Observable<EffectAction> {
        return payload$.pipe(
            withLatestFrom(state$),
            map(([, { id }]) => {
                this.dbHelper.vote(id);
                return this.getActions().setIsVoted(true);
            })
        )
    }

    @Effect()
    unvote(payload$: Observable<object>, state$: Observable<Comment>): Observable<EffectAction> {
        return payload$.pipe(
            withLatestFrom(state$),
            map(([, { id }]) => {
                this.dbHelper.unvote(id);
                return this.getActions().setIsVoted(false);
            })
        )
    }

}
