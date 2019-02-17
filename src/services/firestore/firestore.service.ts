import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;
@Injectable()
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}

  collection<T>(
    ref: CollectionPredicate<T>,
    queryFn?: any
  ): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.afs.collection<T>(ref, queryFn) : ref;
  }

  document<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.afs.doc<T>(ref) : ref;
  }

  collection$(path: any, query?: any) {
    return this.afs
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          console.log('ACTIONS', actions);
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  document$(path: any) {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          console.log('DOC HERE', doc);
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  updateAt(path: string, data: Object): Promise<any> {
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) {
      return this.afs.collection(path).add(data);
    } else {
      return this.afs.doc(path).set(data, { merge: true });
    }
  }

  runTransaction(
    updateFunction: (transaction: firestore.Transaction) => Promise<{}>
  ) {
    return this.afs.firestore.runTransaction(updateFunction);
  }

  arrayUnion(...elements: any[]) {
    return firestore.FieldValue.arrayUnion(...elements);
  }

  arrayRemove(...elements: any[]) {
    return firestore.FieldValue.arrayRemove(...elements);
  }
}
