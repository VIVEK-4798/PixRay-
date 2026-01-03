import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";

export const categories = [
  { name: "cars", image: "https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg" },
  { name: "fitness", image: "https://i.pinimg.com/236x/25/14/29/251429345940a47490cc3d47dfe0a8eb.jpg" },
  { name: "wallpaper", image: "https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg" },
  { name: "websites", image: "https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg" },
  { name: "photo", image: "https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg" },
  { name: "food", image: "https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg" },
  { name: "nature", image: "https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg" },
  { name: "art", image: "https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg" },
  { name: "travel", image: "https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg" },
  { name: "quotes", image: "https://i.pinimg.com/236x/46/7c/17/467c17277badb00b638f8ec4da89a358.jpg" },
  { name: "cats", image: "https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg" },
  { name: "dogs", image: "https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg" },
  { name: "anime", image: "https://4kwallpapers.com/images/walls/thumbs_3t/6478.jpg" },
  { name: "sports", image: "https://pbs.twimg.com/profile_images/1502569716371447810/aDO4Mn-O_400x400.jpg" },
  { name: "others", image: "https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg" }
];

const db = getFirestore();

/* ------------------------------------------------------------ */
/*                       USER DATA                              */
/* ------------------------------------------------------------ */
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("User error:", err);
    return null;
  }
};

/* ------------------------------------------------------------ */
/*                   SEARCH QUERY                                */
/* ------------------------------------------------------------ */
export const searchQuery = async (term) => {
  if (!term) return [];

  const pinsRef = collection(db, "pins");
  const t = term.toLowerCase();

  const titleQ = query(pinsRef, where("title", ">=", t), where("title", "<=", t + "\uf8ff"));
  const catQ = query(pinsRef, where("category", ">=", t), where("category", "<=", t + "\uf8ff"));
  const aboutQ = query(pinsRef, where("about", ">=", t), where("about", "<=", t + "\uf8ff"));

  const [titleSnap, catSnap, aboutSnap] = await Promise.all([
    getDocs(titleQ),
    getDocs(catQ),
    getDocs(aboutQ)
  ]);

  const results = [];

  const pushDocs = (snap) => {
    snap.forEach((docSnap) => {
      if (!results.some((p) => p._id === docSnap.id)) {
        const d = docSnap.data();
        results.push({
          _id: docSnap.id,
          ...d,
          imageUrl: d.imageUrl || d.image || null
        });
      }
    });
  };

  pushDocs(titleSnap);
  pushDocs(catSnap);
  pushDocs(aboutSnap);

  return results;
};

/* ------------------------------------------------------------ */
/*                         FEED QUERY                           */
/* ------------------------------------------------------------ */
export const feedQuery = async () => {
  try {
    const pinsRef = collection(db, "pins");

    let q;
    try {
      q = query(pinsRef, orderBy("createdAt", "desc"));
    } catch {
      q = query(pinsRef, orderBy("_createdAt", "desc"));
    }

    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        _id: docSnap.id,
        ...d,
        imageUrl: d.imageUrl || d.image || null
      };
    });
  } catch (err) {
    console.error("Feed error:", err);
    return [];
  }
};

/* ------------------------------------------------------------ */
/*                     PIN DETAIL QUERY                         */
/* ------------------------------------------------------------ */
export const pinDetailQuery = async (pinId) => {
  const ref = doc(db, "pins", pinId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const d = snap.data();

  return {
    _id: snap.id,
    ...d,
    imageUrl: d.imageUrl || d.image || null
  };
};

/* ------------------------------------------------------------ */
/*                MORE PINS (same category)                     */
/* ------------------------------------------------------------ */
export const pinDetailMorePinQuery = async (pin) => {
  const pinsRef = collection(db, "pins");

  const q = query(
    pinsRef,
    where("category", "==", pin.category),
    where("_id", "!=", pin._id)
  );

  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      _id: docSnap.id,
      ...d,
      imageUrl: d.imageUrl || d.image || null
    };
  });
};

/* ------------------------------------------------------------ */
/*                  USER CREATED PINS                           */
/* ------------------------------------------------------------ */
export const userCreatedPinsQuery = async (userId) => {
  try {
    const pinsRef = collection(db, "pins");

    let q;

    try {
      q = query(
        pinsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } catch (e) {
      q = query(
        pinsRef,
        where("userId", "==", userId),
        orderBy("_createdAt", "desc")
      );
    }

    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      _id: d.id,
      ...d.data(),
      imageUrl: d.data().imageUrl || d.data().image || null
    }));

  } catch (err) {
    console.error(err);
    return [];
  }
};


/* ------------------------------------------------------------ */
/*                    USER SAVED PINS                           */
/* ------------------------------------------------------------ */
export const userSavedPinsQuery = async (userId) => {
  try {
    const pinsRef = collection(db, "pins");

    let q;
    try {
      q = query(pinsRef, orderBy("createdAt", "desc"));
    } catch {
      q = query(pinsRef, orderBy("_createdAt", "desc"));
    }

    const snap = await getDocs(q);

    return snap.docs
      .map((docSnap) => {
        const d = docSnap.data();
        return {
          _id: docSnap.id,
          ...d,
          imageUrl: d.imageUrl || d.image || null
        };
      })
      .filter((pin) => pin.save?.some((s) => s.userId === userId));
  } catch (err) {
    console.error("Saved pins error:", err);
    return [];
  }
};
