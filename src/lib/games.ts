import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  Bytes,
} from "firebase/firestore/lite";

const app = initializeApp({
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

type GameData = { answers: string[]; imageData: Blob };

export async function getGame(id: string) {
  const docRef = doc(db, "games", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data() as
    | { answers: string[]; imageData: Bytes }
    | undefined;
  if (!data) return undefined;
  return {
    ...data,
    imageData: new Blob([data.imageData.toUint8Array()]),
  };
}

export async function createGame(data: GameData) {
  const imageData = await data.imageData.arrayBuffer();
  const result = await addDoc(collection(db, "games"), {
    ...data,
    imageData: Bytes.fromUint8Array(new Uint8Array(imageData)),
  });
  return result.id;
}
