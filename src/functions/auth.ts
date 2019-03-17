import { auth, EventContext } from "firebase-functions";
import { firestore } from "firebase-admin";
import FieldValue = firestore.FieldValue;

import { UserDocument } from "../domain/User";

const onUserCreated = async (user: auth.UserRecord, context: EventContext) => {
  const { uid } = user;

  // TODO move creation logic to domain.
  const newUser: UserDocument = {
    iconImageRef: null,
    activatedOmakeRefs: {},
    publishedOmakeRefs: {},
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };

  await firestore()
    .collection(`users`)
    .doc(uid)
    .set(newUser);
};

export { onUserCreated };
