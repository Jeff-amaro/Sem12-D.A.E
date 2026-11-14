// PART 3 - the hook of the exams screen: the list with its three states, delete and create.
// Run it with:  npm test -- useExams
//
// It must return { status, exams, error, actionError, saving, reload, remove, create }:
//   status       "loading" | "ready" | "error"   (the three states of the request that lists)
//   exams        the array of exams ([] while loading and on error)
//   error        the sentence for the person when the LIST failed (null otherwise); use describeError
//   actionError  the sentence when a delete or a create failed (null otherwise); the list stays as it was
//   saving       true while a create is in flight
//   reload()     asks for the list again (status goes back to "loading")
//   remove(id)   DELETE; when the server confirms, the exam disappears from `exams`; resolves true or false
//   create(title) POST; when the server confirms, the new exam is added; resolves true or false
//
// TODO 1: the state and a useEffect that lists, with the three states. The effect gets an AbortController and a
//         `cancelled` flag, and its cleanup sets the flag and aborts: a late answer must never overwrite a newer one.
// TODO 2: `reload` (a counter that is a dependency of the effect is enough).
// TODO 3: `remove` and `create`. NEVER swallow an error: set `actionError` with describeError. `create` must
//         ignore a second call while the first one is still in flight (use a ref: a state is too late).
// Rule of the course: no hook inside an if, a loop or after a return.
import { createExam, deleteExam, describeError, listExams } from "./api";

export default function useExams() {
  return {
    status: "loading",
    exams: [],
    error: null,
    actionError: null,
    saving: false,
    reload: () => {},
    remove: async () => false,
    create: async () => false,
  };
}
