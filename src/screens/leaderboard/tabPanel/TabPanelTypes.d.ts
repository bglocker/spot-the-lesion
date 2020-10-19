interface TabPanelProps {
  currentIndex: number;
  index: number;
  dbRef: firebase.firestore.CollectionReference;
}

interface Score {
  username: string;
  score: number;
}
