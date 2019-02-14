import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FirestoreService {
  constructor(private afs: AngularFirestore) {}

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

  doc$(path: any) {
    return this.afs
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          console.log('DOC HERE');
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
}
