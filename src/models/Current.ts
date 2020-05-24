import {Injectable} from "@asuka/di";
import {Ayanami, ImmerReducer} from "ayanami";

interface State {
    commentId: number;
    extraInfo: string;
    // isSubmitting: boolean;
}

@Injectable()
export default class Current extends Ayanami<State> {
    defaultState = {
        commentId: -1,
        extraInfo: '',
        // isSubmitting: false,
    }

    @ImmerReducer()
    setCommentId(state: State, commentId: number) {
        state.commentId = commentId;
    }

    @ImmerReducer()
    setExtraInfo(state: State, info: string) {
        state.extraInfo = info;
    }

    // @ImmerReducer()
    // setIsSubmitting(state: State, isSubmitting: boolean) {
    //     state.isSubmitting = isSubmitting;
    // }
}
