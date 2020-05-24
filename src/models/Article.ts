import {Ayanami, Effect, EffectAction, ImmerReducer, Reducer} from "ayanami";
import Article from "../entities/Article";
import {Observable, of} from "rxjs";
import {map, mergeMap, withLatestFrom} from "rxjs/operators";
import DbHelper from "../utils/db";
import {Injectable} from "@asuka/di";

@Injectable()
export default class ArticleModel extends Ayanami<Article> {
    defaultState = {
        id: -1,
        title: '',
        points: 0,
        domain: '',
        poster: '',
        time: 0,
        commentsCount: 0,
        commentIds: [],
    }

    constructor(private readonly dbHelper: DbHelper) {
        super();
    }

    @Reducer()
    setArticle(state: Article, article: Article) {
        return article;
    }

    @ImmerReducer()
    setComments(state: Article, commentIds: number[]) {
        state.commentIds = commentIds;
    }

    @ImmerReducer()
    setCount(state: Article, count: number) {
        state.commentsCount = count;
    }

    @Effect()
    updateArticle(id$: Observable<number>): Observable<EffectAction> {
        return id$.pipe(
            map(id => this.getActions().setArticle(this.dbHelper.getArticle(id)))
        );
    }

    @Effect()
    comment(content$: Observable<string>, acticle$: Observable<Article>): Observable<EffectAction> {
        return content$.pipe(
            withLatestFrom(acticle$),
            mergeMap(([content, { id, commentIds, commentsCount }]) => {
                const comment = this.dbHelper.comment(id, content);
                const actions = this.getActions();
                return of(
                    actions.setComments((commentIds || []).concat(comment.id)),
                    actions.setCount(commentsCount + 1) as EffectAction,
                );
            })
        )
    }
}
